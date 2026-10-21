/**
 * Curated high-resolution studio photography for hardware products & digital solutions.
 * Follows Industrial Calm Tech aesthetic (Apple / Braun / Studio lighting, clean neutral backgrounds).
 */

export const HARDWARE_IMAGE_MAP: Record<string, string> = {
  // Ergonomics & Posture
  cushion: 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&w=800&q=80',
  posture: 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&w=800&q=80',
  chair: 'https://images.unsplash.com/photo-1580481077114-1628d0e74f8f?auto=format&fit=crop&w=800&q=80',
  stand: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=800&q=80',
  laptop: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=800&q=80',
  keyboard: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=800&q=80',
  mouse: 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?auto=format&fit=crop&w=800&q=80',

  // Audio & Noise Cancellation
  headphones: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80',
  audio: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=800&q=80',
  earbuds: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=800&q=80',
  speaker: 'https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&w=800&q=80',

  // Home Automation & Cleaning
  vacuum: 'https://images.unsplash.com/photo-1558317374-067fb5f30001?auto=format&fit=crop&w=800&q=80',
  robot: 'https://images.unsplash.com/photo-1558317374-067fb5f30001?auto=format&fit=crop&w=800&q=80',
  mop: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=800&q=80',
  cleaning: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=800&q=80',

  // Focus & Time
  clock: 'https://images.unsplash.com/photo-1508057198894-247b23fe5ade?auto=format&fit=crop&w=800&q=80',
  timer: 'https://images.unsplash.com/photo-1508057198894-247b23fe5ade?auto=format&fit=crop&w=800&q=80',
  watch: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80',

  // Desk & Organization
  desk: 'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?auto=format&fit=crop&w=800&q=80',
  organizer: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=800&q=80',
  lamp: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=800&q=80',

  // Pet & Behavioral
  pet: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&w=800&q=80',
  camera: 'https://images.unsplash.com/photo-1557862921-37829c790f19?auto=format&fit=crop&w=800&q=80',
  toy: 'https://images.unsplash.com/photo-1576201836106-db1758fd1c97?auto=format&fit=crop&w=800&q=80',
};

export const DIGITAL_IMAGE_MAP: Record<string, string> = {
  // Notion & Productivity Systems
  notion: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=800&q=80',
  template: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80',
  sistema: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80',

  // Online Courses & Masterclasses
  course: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80',
  curso: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80',
  masterclass: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=800&q=80',
  video: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=800&q=80',

  // Ebooks & Methods
  ebook: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80',
  metodo: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&w=800&q=80',
  guia: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&w=800&q=80',

  // App & SaaS
  app: 'https://images.unsplash.com/photo-1551650975-87deedd944c3?auto=format&fit=crop&w=800&q=80',
  saas: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80',
};

export function getProductStudioImage(
  name: string,
  category: string,
  type: 'physical' | 'digital',
  explicitUrl?: string
): string {
  if (explicitUrl && explicitUrl.startsWith('http')) {
    return explicitUrl;
  }

  const combined = (name + ' ' + category).toLowerCase();

  if (type === 'physical') {
    if (combined.includes('fone') || combined.includes('headphone') || combined.includes('anc') || combined.includes('auricular')) {
      return HARDWARE_IMAGE_MAP.headphones;
    }
    if (combined.includes('almofada') || combined.includes('lombar') || combined.includes('cervical') || combined.includes('postur')) {
      return HARDWARE_IMAGE_MAP.cushion;
    }
    if (combined.includes('suporte') || combined.includes('notebook') || combined.includes('laptop') || combined.includes('aluminio')) {
      return HARDWARE_IMAGE_MAP.stand;
    }
    if (combined.includes('aspirador') || combined.includes('robo') || combined.includes('limpeza') || combined.includes('pano')) {
      return HARDWARE_IMAGE_MAP.vacuum;
    }
    if (combined.includes('timer') || combined.includes('relogio') || combined.includes('pomodoro') || combined.includes('tempo')) {
      return HARDWARE_IMAGE_MAP.timer;
    }
    if (combined.includes('mop') || combined.includes('balde')) {
      return HARDWARE_IMAGE_MAP.mop;
    }
    if (combined.includes('organizador') || combined.includes('mesa')) {
      return HARDWARE_IMAGE_MAP.organizer;
    }
    if (combined.includes('som') || combined.includes('ruido') || combined.includes('caixa')) {
      return HARDWARE_IMAGE_MAP.speaker;
    }
    if (combined.includes('pet') || combined.includes('cao') || combined.includes('cachorro') || combined.includes('brinquedo')) {
      return HARDWARE_IMAGE_MAP.pet;
    }
    if (combined.includes('camera') || combined.includes('wifi') || combined.includes('seguranca')) {
      return HARDWARE_IMAGE_MAP.camera;
    }
    return HARDWARE_IMAGE_MAP.desk;
  } else {
    if (combined.includes('notion') || combined.includes('template') || combined.includes('planner')) {
      return DIGITAL_IMAGE_MAP.notion;
    }
    if (combined.includes('curso') || combined.includes('aula') || combined.includes('treinamento') || combined.includes('masterclass')) {
      return DIGITAL_IMAGE_MAP.course;
    }
    if (combined.includes('ebook') || combined.includes('livro') || combined.includes('guia') || combined.includes('manual')) {
      return DIGITAL_IMAGE_MAP.ebook;
    }
    if (combined.includes('app') || combined.includes('software') || combined.includes('saas')) {
      return DIGITAL_IMAGE_MAP.app;
    }
    return DIGITAL_IMAGE_MAP.sistema;
  }
}
