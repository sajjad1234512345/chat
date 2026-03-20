import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const FCM_SERVER_KEY = Deno.env.get('FCM_SERVER_KEY') // Set this in Supabase Dashboard Secrets

serve(async (req) => {
  try {
    const payload = await req.json()
    
    // This function expects to be called via a Database Webhook on the `notifications` table
    // Payload structure depends on the webhook configuration. Assuming it's an INSERT webhook:
    const notification = payload.record

    if (!notification || !notification.user_id) {
      return new Response(JSON.stringify({ error: 'Invalid payload' }), { status: 400 })
    }

    // Initialize Supabase client to fetch FCM tokens
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Fetch the user's FCM tokens
    const { data: tokensData, error: tokensError } = await supabase
      .from('fcm_tokens')
      .select('token')
      .eq('user_id', notification.user_id)

    if (tokensError) {
      throw tokensError
    }

    const tokens = tokensData.map(t => t.token)

    if (tokens.length === 0) {
      return new Response(JSON.stringify({ message: 'No FCM tokens found for user' }), { status: 200 })
    }

    // Send FCM notification
    // Note: This uses the legacy HTTP API for simplicity. For HTTP v1, you need to generate an OAuth2 token.
    const fcmResponse = await fetch('https://fcm.googleapis.com/fcm/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `key=${FCM_SERVER_KEY}`
      },
      body: JSON.stringify({
        registration_ids: tokens,
        notification: {
          title: notification.title,
          body: notification.body
        },
        data: {
          ref_id: notification.ref_id,
          ref_type: notification.ref_type,
          type: notification.type
        }
      })
    })

    const fcmResult = await fcmResponse.json()

    return new Response(
      JSON.stringify({ success: true, fcmResult }),
      { headers: { "Content-Type": "application/json" } },
    )
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 })
  }
})
