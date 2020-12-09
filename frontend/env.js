const dev = process.env.NODE_ENV !== 'production' && process.env.NODE_ENV !== 'staging';
const staging = process.env.NODE_ENV !== 'dev' && process.env.NODE_ENV !== 'production'

export const server = dev ? 'http://localhost:8000' : staging ? 'https://linkapp.epicsandbox.com' : 'https://app.sitecrawler.com';