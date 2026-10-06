# CLAUDE.md — montesblanco-web

Web pública de **Montes Blanco Real Estate SL** (inmobiliaria en Dos Hermanas, Sevilla).
Proyecto independiente de Dynamo: no mezclar nada con dynamo-web ni con su Supabase.

## Qué es este repo
- Web estática: HTML + CSS + JS vanilla, sin build. Vercel despliega `main` en https://www.montesblanco.com.
- Idiomas: el selector usa Google Translate (`js/main.js`, cookie `googtrans`). `js/translations.json` y los `data-i18n` del HTML son restos del sistema anterior y hoy no se usan.
- Contacto: WhatsApp, teléfono y email. Todavía no hay formulario.

## Relación con la plataforma
- La **plataforma interna de gestión** es OTRO proyecto: repo `dynamotrans/montesblanco-plataforma`, con su propio proyecto en Vercel y su propio Supabase (solo de Montes Blanco). Se publica en https://gestion.montesblanco.com.
- Esta web solo enlaza con ella ("Acceso a la plataforma de gestión", en el pie de página) y, más adelante, le enviará los leads del formulario de contacto a su API (`gestion.montesblanco.com/api/leads`).
- En este repo no puede haber nunca claves, tokens ni conexión directa a la base de datos.

## Reglas de trabajo
- No trabajar nunca directamente en `main`, porque se publica en producción. Usar la rama `lab/plataforma` o una rama nueva.
- Preguntar SIEMPRE al usuario antes de cada `git push`.
- Confirmar proyecto y rama antes de tocar nada.

## Legal
- Nada de llamadas, WhatsApp ni emails masivos automáticos a particulares sacados de los portales: lo prohíben la Ley 11/2022, la LSSI y el RGPD, y las condiciones de los portales prohíben el scraping.
- Los automatismos son solo para quien nos ha contactado o ha dado su consentimiento.
- Un formulario que recoja datos lleva una casilla de consentimiento obligatoria con enlace a `privacidad.html`, y la política de privacidad debe reflejar los nuevos tratamientos.

## Bitácora
- **2026-10-06** — Se decide separar la web y la plataforma en dos repos. Rama `lab/plataforma` creada desde `main`. Enlace "Acceso a la plataforma de gestión" añadido en el pie de página, apuntando a `gestion.montesblanco.com`. Corregido el README, que decía que había un formulario FormSubmit que en realidad no existía.
