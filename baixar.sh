#!/usr/bin/env bash
# Baixa os vídeos de videos.txt do canal oficial da Rockstar e publica cada um
# como arquivo da release "midia", com link público para o invideo importar.
set -uo pipefail

CANAL="https://www.youtube.com/@RockstarGames/videos"
TAG="midia"
LOG="status.md"
mkdir -p saida

{
  echo "# Última execução"
  echo
  echo "Quando: $(date -u '+%Y-%m-%d %H:%M UTC')"
  echo
} > "$LOG"

echo "Listando o canal..."
yt-dlp --flat-playlist --playlist-end 80 \
  --print "%(id)s	%(title)s" "$CANAL" > canal.tsv 2> canal.err
if [ ! -s canal.tsv ]; then
  echo "## Falhou ao listar o canal" >> "$LOG"
  echo '```' >> "$LOG"; tail -n 30 canal.err >> "$LOG"; echo '```' >> "$LOG"
  exit 1
fi
{ echo "## Vídeos do canal (mais recentes)"; echo '```'; head -n 40 canal.tsv; echo '```'; echo; } >> "$LOG"

gh release view "$TAG" >/dev/null 2>&1 || \
  gh release create "$TAG" --title "Mídia oficial GTA VI" --notes "Arquivos baixados do canal oficial da Rockstar Games." >/dev/null

echo "## Resultado" >> "$LOG"
grep -v '^\s*#' videos.txt | grep -v '^\s*$' | while IFS='|' read -r nome padrao; do
  nome="$(echo "$nome" | xargs)"; padrao="$(echo "$padrao" | xargs)"
  if gh release view "$TAG" --json assets -q '.assets[].name' | grep -qx "$nome.mp4"; then
    echo "- $nome: já estava publicado" >> "$LOG"; continue
  fi
  linha="$(grep -i -- "$padrao" canal.tsv | head -n 1)"
  if [ -z "$linha" ]; then
    echo "- $nome: nenhum vídeo com \"$padrao\" no título" >> "$LOG"; continue
  fi
  id="${linha%%	*}"; titulo="${linha#*	}"
  echo "Baixando $nome ($titulo)..."
  if yt-dlp -f "bv*[height<=1080][vcodec^=avc1]+ba[ext=m4a]/bv*[height<=1080]+ba/b[height<=1080]" \
       --merge-output-format mp4 -o "saida/$nome.%(ext)s" \
       "https://www.youtube.com/watch?v=$id" > "saida/$nome.log" 2>&1; then
    arq="saida/$nome.mp4"
    tam=$(stat -c %s "$arq")
    if [ "$tam" -gt 1900000000 ]; then
      ffmpeg -loglevel error -y -i "$arq" -vf "scale=-2:720" -c:v libx264 -preset veryfast -crf 23 -c:a copy "saida/$nome-720.mp4" \
        && mv "saida/$nome-720.mp4" "$arq"
      tam=$(stat -c %s "$arq")
    fi
    gh release upload "$TAG" "$arq" --clobber
    echo "- $nome: OK — \"$titulo\" ($id), $((tam/1048576)) MB" >> "$LOG"
  else
    echo "- $nome: erro ao baixar \"$titulo\" ($id)" >> "$LOG"
    echo '```' >> "$LOG"; tail -n 15 "saida/$nome.log" >> "$LOG"; echo '```' >> "$LOG"
  fi
done

echo >> "$LOG"
echo "Links: https://github.com/${GITHUB_REPOSITORY}/releases/download/$TAG/<nome>.mp4" >> "$LOG"
