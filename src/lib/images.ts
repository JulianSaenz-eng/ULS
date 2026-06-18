const SUPABASE_URL = 'https://yildjcqajijsbjgphomo.supabase.co';
const STORAGE_BUCKET = 'landscape-images';

const getImageUrl = (filename: string) =>
  `${SUPABASE_URL}/storage/v1/object/public/${STORAGE_BUCKET}/${filename}`;

export const images = {
  logo: getImageUrl('ulslogo1.png'),
  teamMember: getImageUrl('juanteamphoto.png'),
  hero: '/ULSHERO.webp',
  landscapeCard: getImageUrl('landcsape_card_ultimate_landscaping_services.png'),
  sod: getImageUrl('sod.webp'),
  curbInstallation: getImageUrl('curbinstillation.webp'),
  irrigationRepair: getImageUrl('irrigationrepait.webp'),
  lawnMaintenance: getImageUrl('lawn_maintance.webp'),
  showcase1: getImageUrl('1ult1.png'),
  showcase2: getImageUrl('2ult2.png'),
  showcase3: getImageUrl('3ult3.png'),
};
