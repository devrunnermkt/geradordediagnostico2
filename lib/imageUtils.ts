// Conversão de imagens enviadas pelo usuário em data URLs base64, já
// redimensionadas para reduzir o peso salvo no localStorage/JSON.

const MAX_WIDTH = 1400;
const JPEG_QUALITY = 0.8;

export function resizeImageToDataUrl(
  file: File,
  maxWidth: number = MAX_WIDTH,
  quality: number = JPEG_QUALITY
): Promise<string> {
  return new Promise((resolve, reject) => {
    const objectUrl = URL.createObjectURL(file);
    const imagem = new Image();

    imagem.onload = () => {
      const escala = Math.min(1, maxWidth / imagem.width);
      const largura = Math.round(imagem.width * escala);
      const altura = Math.round(imagem.height * escala);

      const canvas = document.createElement("canvas");
      canvas.width = largura;
      canvas.height = altura;

      const ctx = canvas.getContext("2d");
      if (!ctx) {
        URL.revokeObjectURL(objectUrl);
        reject(new Error("Não foi possível processar a imagem."));
        return;
      }

      ctx.drawImage(imagem, 0, 0, largura, altura);
      URL.revokeObjectURL(objectUrl);
      resolve(canvas.toDataURL("image/jpeg", quality));
    };

    imagem.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error("Não foi possível carregar a imagem."));
    };

    imagem.src = objectUrl;
  });
}
