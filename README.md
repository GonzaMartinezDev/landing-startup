# Landing para startup de desarrollo

Landing de Comodoro Dev's. Archivos HTML, CSS y JavaScript sin dependencias.

## Ver localmente
Extraé el ZIP. Abrí esta carpeta en VS Code y abrí index.html con el navegador. También podés usar la extensión Live Server de VS Code y hacer clic en Go Live. No se necesita npm install, Docker, backend ni base de datos.

## Trabajar con Codex
Abrí esta carpeta como proyecto con Codex. Pegá el contenido de PROMPT-CODEX.md. La marca y los datos de contacto ya están configurados: vmgonzalo@hotmail.com y WhatsApp +54 280 4206653.

## Subir a GitHub
Creá un repositorio vacío llamado landing-startup en tu cuenta GonzaMartinezDev. No agregues README desde GitHub si vas a usar los siguientes comandos. En la terminal de VS Code, dentro de esta carpeta:

```sh
git init
git add .
git commit -m "Landing inicial de startup"
git branch -M main
git remote add origin https://github.com/GonzaMartinezDev/landing-startup.git
git push -u origin main
```

Usá esa URL solo si creaste el repositorio con ese nombre. Si GitHub pide autenticación, completá el inicio de sesión. No escribas tokens dentro del código. El repositorio puede ser privado; la visibilidad del código y la del sitio web son decisiones separadas.

## Publicar en Vercel
1. Entrá a https://vercel.com y conectá tu cuenta de GitHub.
2. Add New → Project. Importá landing-startup. Autorizá el acceso a ese repositorio si no aparece.
3. Framework Preset: Other. Root Directory: raíz del repositorio (carpeta que contiene index.html).
4. Build Command: vacío, sin comando. Output Directory: punto (.). No hacen falta variables de entorno. vercel.json ya declara esta configuración.
5. Deploy. Al terminar, Vercel muestra la URL asignada. Comprobá el sitio desde el celular y una ventana privada.
6. Los cambios enviados a la rama de producción, normalmente main, disparan otro despliegue.

El plan Hobby de Vercel es solo para uso personal no comercial. Para publicar la landing comercial de la startup corresponde un plan que permita ese uso, como Pro. Revisá el precio y las condiciones actuales antes de contratar: https://vercel.com/docs/plans/hobby y https://vercel.com/pricing.

## Cambios posteriores
```sh
git add .
git commit -m "Actualizar contenido de landing"
git push
```

## Dominio propio
Podés comenzar con la dirección asignada por Vercel. Cuando tengas un dominio, agregalo desde Settings → Domains del proyecto y configurá los registros DNS que Vercel te indique en tu proveedor. Hosting es dónde se sirve la web; dominio es la dirección con la que acceden tus visitantes.

## Pendientes reales
- Comprobar que el enlace de WhatsApp abra la cuenta correcta antes de publicar.
- El formulario NO envía ni guarda consultas. Prepara el texto para copiar y completa los enlaces de WhatsApp y email; el visitante confirma el envío en la aplicación elegida.
- No contiene credenciales ni necesita archivo .env.
- Revisar visualmente en navegador antes del lanzamiento.

Documentación: https://vercel.com/docs/git y https://vercel.com/docs/builds/configure-a-build.
