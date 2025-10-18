set -e
cd /workspaces/ActualFork

apt-get update -y >/dev/null 2>&1 || true
apt-get install -y jq tmux >/dev/null 2>&1 || true

export JQ_PATH="$(command -v jq)"
mkdir -p node_modules/node-jq/bin
ln -sf "$JQ_PATH" node_modules/node-jq/bin/jq || true

yarn config set nodeLinker node-modules >/dev/null
JQ_PATH="$JQ_PATH" yarn install --inline-builds || true

node - <<'NODE'
const fs=require('fs'), p='packages/sync-server/tsconfig.json';
const j=JSON.parse(fs.readFileSync(p,'utf8'));
j.compilerOptions=j.compilerOptions||{};
const s=new Set(j.compilerOptions.types||[]);
s.delete('vite/client'); s.delete('vitest/globals'); s.add('node');
j.compilerOptions.types=[...s];
fs.writeFileSync(p, JSON.stringify(j,null,2));
console.log('sync-server tsconfig types ->', j.compilerOptions.types);
NODE

yarn workspace @actual-app/sync-server add -D typescript @types/node

mkdir -p packages/sync-server/build/src
cp -r packages/sync-server/src/sql packages/sync-server/build/src/sql 2>/dev/null || true

yarn workspace @actual-app/sync-server tsc -p tsconfig.json

WEB_PKG=packages/desktop-client/package.json
SRV_PKG=packages/sync-server/package.json
WEB_SCRIPT=$(node -e "const s=require('./$WEB_PKG').scripts||{}; const c=['start','desktop-dev','dev','vite','web:dev']; console.log(c.find(k=>s[k])||'');")
SRV_SCRIPT=$(node -e "const s=require('./$SRV_PKG').scripts||{}; const c=['start','dev','serve']; console.log(c.find(k=>s[k])||'');")
echo "Web script:  ${WEB_SCRIPT:-<none>}"; echo "Srv script:  ${SRV_SCRIPT:-<none>}"

tmux kill-session -t actual-dev 2>/dev/null || true
tmux new-session -d -s actual-dev -c /workspaces/ActualFork
tmux send-keys -t actual-dev:0 "export JQ_PATH=\"\$(command -v jq)\"; yarn workspace @actual-app/sync-server $SRV_SCRIPT" C-m
tmux split-window -h -t actual-dev:0 -c /workspaces/ActualFork
tmux send-keys -t actual-dev:0.1 "yarn workspace @actual-app/web $WEB_SCRIPT" C-m
tmux select-pane -t actual-dev:0.1
tmux attach -t actual-dev
