cat << EOF > sample.ts
function hoge(x: string) {
  console.log(x);
}
EOF

npx tsserver << EOF | tail -n 1 | jq .body
{"command":"open","arguments":{"file":"${PWD}/sample.ts"}}
{"command":"quickinfo","arguments":{"file":"${PWD}/sample.ts","line":2,"offset":15}}
EOF
