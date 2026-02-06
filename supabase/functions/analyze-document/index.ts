// supabase/functions/analyze-document/index.ts

import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3"
import Groq from "npm:groq-sdk@0.3.3"
import pdf from "npm:pdf-parse@1.1.1"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { record } = await req.json()
    
    if (!record || !record.file_key) {
      return new Response(JSON.stringify({ error: "Payload inválido" }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 })
    }

    console.log(`🤖 Iniciando análise: ${record.nome}`)

    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? ''
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    const groqApiKey = Deno.env.get('GROQ_API_KEY') ?? ''

    const supabase = createClient(supabaseUrl, supabaseKey)
    const groq = new Groq({ apiKey: groqApiKey })

    // Baixar PDF
    const { data: fileData, error: downloadError } = await supabase
      .storage
      .from('documentos_processos')
      .download(record.file_key)

    if (downloadError) throw downloadError

    // Extrair Texto
    const arrayBuffer = await fileData.arrayBuffer()
    const buffer = new Uint8Array(arrayBuffer)
    const data = await pdf(buffer)
    const textoCompleto = data.text

    const textoFocado = `
      --- INÍCIO ---
      ${textoCompleto.substring(0, 15000)}
      --- FIM ---
      ${textoCompleto.slice(-5000)}
    `

    // IA
    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "Você é um Agente Jurídico. Retorne APENAS JSON."
        },
        {
          role: "user",
          content: `
            Analise este texto jurídico.
            Retorne JSON: {
              "tipo_documento": "string",
              "resumo": "string",
              "tem_prazo": boolean,
              "dias_prazo": number|null,
              "urgencia": "Alta"|"Média"|"Baixa",
              "recomendacao": "string"
            }
            Texto: ${textoFocado}
          `
        }
      ],
      model: "llama3-70b-8192",
      temperature: 0.1,
      response_format: { type: "json_object" }
    })

    const aiResponse = JSON.parse(completion.choices[0]?.message?.content || "{}")
    
    // Salvar no Banco
    let dataPrazo = null
    if (aiResponse.tem_prazo && aiResponse.dias_prazo) {
       const hoje = new Date()
       const futuro = new Date(hoje.setDate(hoje.getDate() + aiResponse.dias_prazo))
       dataPrazo = futuro.toISOString()
    }

    await supabase.from('processamentos_ia').insert({
        user_id: record.user_id,
        processo_id: record.processo_id,
        insight_json: aiResponse,
        nivel_urgencia: aiResponse.urgencia || "Baixa",
        prazo_detectado: dataPrazo
    })

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    })
  }
})