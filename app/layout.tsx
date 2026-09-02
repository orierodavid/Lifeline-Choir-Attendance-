import './globals.css'
import './admin-login.css'
import './admin-futuristic.css'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Lifeline Choir Attendance', description: 'Lifeline Choir Attendance System' }

export default function RootLayout({ children }: { children: React.ReactNode }) { return <html lang="en"><body>{children}</body></html> }