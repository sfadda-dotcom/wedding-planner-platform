
import { prisma } from '@/lib/db';
import { TemplatesGallery } from '@/components/templates/templates-gallery';
import { WeddingTemplate } from '@prisma/client';

export default async function TemplatesPage() {
  const templates = await prisma.weddingTemplate.findMany({
    orderBy: [
      { type: 'asc' },
      { createdAt: 'desc' }
    ]
  });

  const invitationTemplates = templates?.filter((t: WeddingTemplate) => t?.type === 'invitation') || [];
  const vowTemplates = templates?.filter((t: WeddingTemplate) => t?.type === 'vows') || [];

  return (
    <TemplatesGallery 
      invitationTemplates={invitationTemplates}
      vowTemplates={vowTemplates}
    />
  );
}
