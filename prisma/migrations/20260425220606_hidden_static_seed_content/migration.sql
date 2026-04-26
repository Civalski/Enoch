-- AlterTable
ALTER TABLE "InstitutionalSiteContent" ADD COLUMN     "hiddenStaticBlogSlugs" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "hiddenStaticProjectTitles" TEXT[] DEFAULT ARRAY[]::TEXT[];
