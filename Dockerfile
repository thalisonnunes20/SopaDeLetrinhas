FROM nginxinc/nginx-unprivileged:1.27-alpine

# Configuração do servidor (cabeçalhos de segurança, compressão, arquivos ocultos bloqueados)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Somente os arquivos do jogo vão para a imagem
COPY index.html /usr/share/nginx/html/index.html
COPY css/ /usr/share/nginx/html/css/
COPY js/ /usr/share/nginx/html/js/

# O nginx-unprivileged já roda como usuário comum (não root) na porta 8080
EXPOSE 8080

HEALTHCHECK --interval=30s --timeout=3s --retries=3 \
  CMD wget -q --spider http://127.0.0.1:8080/ || exit 1
