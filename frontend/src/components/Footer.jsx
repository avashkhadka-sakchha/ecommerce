export default function Footer() {
  return (
    <footer style={{ background: '#0D0D16', color: 'rgba(255,255,255,.55)', marginTop: 0 }}>
      <div style={{ borderBottom: '1px solid rgba(255,255,255,.06)', padding: '56px 0 48px' }}>
        <div style={{ 
          maxWidth: 1280, 
          margin: '0 auto', 
          padding: '0 28px', 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', 
          gap: 40 
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18 }}>
              <div style={{ width: 36, height: 36, background: 'var(--accent)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span className="ff" style={{ color: '#fff', fontWeight: 900, fontSize: 19 }}>M</span>
              </div>
              <span className="ff" style={{ fontSize: 18, fontWeight: 700, color: '#fff' }}>MobileHub</span>
            </div>
            <p style={{ fontSize: 13, lineHeight: 1.8, maxWidth: 240 }}>
              Nepal's go-to destination for premium mobile accessories. Style meets reliability for every device you own.
            </p>
          </div>
          {[
            { title: 'Quick Links', links: ['About Us', 'Our Blog', 'Careers', 'Affiliate Program'] },
            { title: 'Customer Support', links: ['Help Center', 'Return Policy', 'Shipping Info', 'Contact Us'] },
          ].map(col => (
            <div key={col.title}>
              <h4 style={{ color: '#fff', fontSize: 12, fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase', marginBottom: 18 }}>{col.title}</h4>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 11 }}>
                {col.links.map(l => (
                  <li key={l}>
                    <a href="#" style={{ fontSize: 13, color: 'rgba(255,255,255,.5)', transition: 'color .2s ease' }}
                      onMouseEnter={e => e.target.style.color = 'rgba(255,255,255,.9)'}
                      onMouseLeave={e => e.target.style.color = 'rgba(255,255,255,.5)'}
                    >{l}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
          <div>
            <h4 style={{ color: '#fff', fontSize: 12, fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase', marginBottom: 18 }}>Stay in the loop</h4>
            <p style={{ fontSize: 13, marginBottom: 14, lineHeight: 1.7 }}>Get exclusive deals and new product alerts.</p>
            <div style={{ display: 'flex', gap: 8 }}>
              <input type="email" placeholder="you@email.com" className="finp" style={{ flex: 1, fontSize: 13, padding: '10px 14px', background: 'rgba(255,255,255,.07)', borderColor: 'rgba(255,255,255,.12)', color: '#fff' }} />
              <button className="btn btn-p btn-sm" style={{ flexShrink: 0, borderRadius: 11 }}>Join</button>
            </div>
          </div>
        </div>
      </div>
      <div style={{ 
        maxWidth: 1280, 
        margin: '0 auto', 
        padding: '20px 28px', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between', 
        gap: 16, 
        flexWrap: 'wrap' 
      }}>
        <span style={{ fontSize: 12 }}>© 2026 MobileHub Nepal. All rights reserved.</span>
        <div style={{ display: 'flex', gap: 24 }}>
          {['Privacy Policy', 'Terms of Service', 'Cookies'].map(l => (
            <a key={l} href="#" style={{ fontSize: 12, color: 'rgba(255,255,255,.3)', transition: 'color .2s' }}
              onMouseEnter={e => e.target.style.color = 'rgba(255,255,255,.7)'}
              onMouseLeave={e => e.target.style.color = 'rgba(255,255,255,.3)'}
            >{l}</a>
          ))}
        </div>
      </div>
    </footer>
  );
}
