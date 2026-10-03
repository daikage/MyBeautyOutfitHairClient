/**
 * ✏️  EVERYTHING ABOUT THE STYLIST LIVES HERE.
 *
 * Update the phone number, email, Instagram handle, service area and opening
 * hours in this one file - the whole site (nav, footer, contact page, booking
 * form) reads from it.
 */
export const salon = {
  name: 'My Beauty Outfit Hair',
  shortName: 'My Beauty Outfit',
  monogram: 'MBO',
  tagline: 'Where your crown is treated like art',
  intro:
    'A private Texas studio for Black women who want their hair done slowly, carefully and beautifully.',
  stylist: 'Mum',
  stylistRole: 'Master Stylist & Founder',
  bio: [
    'For over a decade I have been braiding, twisting, pressing and installing hair for the women of Texas - daughters, mothers, brides and everybody in between.',
    'My studio is by appointment only, so there is never a crowd, never a rush and never a stranger working on your head. You get a quiet chair, a cup of tea, good music and hands that treat your edges like they matter (because they do).',
  ],
  // 📞 Replace with Mum's real details before sharing the site.
  phone: '(713) 555-0142',
  phoneHref: '+17135550142',
  email: 'hello@mybeautyoutfithair.com',
  instagram: 'mybeautyoutfithair',
  instagramUrl: 'https://www.instagram.com/',
  tiktokUrl: '',
  addressLines: ['Private studio · By appointment only', 'Texas, USA'],
  serviceArea: 'Serving clients across the Greater Houston, Dallas–Fort Worth and Central Texas areas.',
  travelNote: 'Travel to your home or venue available on request (a travel fee may apply).',
  mapNote: 'The studio address is shared with your booking confirmation.',
  hours: [
    { day: 'Tuesday – Friday', time: '9:00 am – 7:00 pm' },
    { day: 'Saturday', time: '8:00 am – 6:00 pm' },
    { day: 'Sunday – Monday', time: 'Closed' },
  ],
  stats: [
    { value: '12+', label: 'Years styling' },
    { value: '55+', label: 'Signature styles' },
    { value: '1,200+', label: 'Happy clients' },
    { value: '5.0', label: 'Average rating' },
  ],
  policyNote:
    'A small deposit secures every appointment and comes off your final total. Please arrive with hair washed, detangled and product-free unless your service includes a wash.',
};

/** Big parallax bands used across the site (art ships in /public/art). */
export const bands = {
  braids: '/art/band-braids.svg',
  bridal: '/art/band-bridal.svg',
  silk: '/art/band-silk.svg',
  locs: '/art/band-locs.svg',
  hero: '/art/hero.svg',
  studio: '/logo-alt.jpg',
};

export const navLinks = [
  { to: '/', label: 'Home' },
  { to: '/styles', label: 'Style Menu' },
  { to: '/services', label: 'Services' },
  { to: '/about', label: 'The Studio' },
  { to: '/book', label: 'Book' },
];

export const fallbackContent = {
  announcement: 'Private studio appointments in Texas — booking now for the season.',
  heroEyebrow: 'Texas · Luxury Hair Studio',
  heroTitle: 'Where your crown is treated like art',
  heroSubtitle:
    'Braids, locs, weaves, silk presses and bridal hair — crafted slowly, carefully and beautifully for Black women who deserve the very best.',
};