$env:NODE_ENV='production'
npx tailwindcss -o ./tailwind.css --minify
$env:NODE_ENV=''
