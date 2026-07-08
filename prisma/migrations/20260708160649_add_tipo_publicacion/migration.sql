-- CreateEnum
CREATE TYPE "TipoPublicacion" AS ENUM ('BLOG', 'NOTICIA');

-- AlterTable
ALTER TABLE "publicaciones" ADD COLUMN     "tipo" "TipoPublicacion" NOT NULL DEFAULT 'BLOG';
