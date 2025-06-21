import Reviews from '../components/Reviews';
import VideoTour from '../components/VideoTour';
import StatsBox from '../components/StatsBox';
import { FaWhatsapp, FaPhone, FaFacebook, FaSnapchatGhost, FaTwitter, FaInstagram, FaTelegram, FaDiscord, FaEnvelope } from 'react-icons/fa';
import { defaultContacts as contacts } from '../data/contacts';
import { useState } from 'react';

export default function ContactPage() {
  const [showContacts, setShowContacts] = useState(false);
  return (
    <div style={{maxWidth:700,margin:'32px auto',background:'#fff',borderRadius:16,padding:24,boxShadow:'0 2px 16px #eee'}}>
      <h2 style={{color:'#00bcd4',marginBottom:16}}>تواصل معنا</h2>
      <button onClick={()=>setShowContacts(!showContacts)} style={{background:'#00bcd4',color:'#fff',border:'none',borderRadius:8,padding:'12px 32px',fontWeight:'bold',fontSize:20,cursor:'pointer',marginBottom:24}}>إظهار وسائل التواصل</button>
      {showContacts && (
        <div style={{marginTop:8,display:'flex',flexWrap:'wrap',justifyContent:'center',gap:18}}>
          <a href={`https://wa.me/${contacts.whatsapp}`} target="_blank" rel="noopener noreferrer" style={{color:'#25d366',fontSize:28}} title="واتساب"><FaWhatsapp /></a>
          <a href={`tel:${contacts.phone}`} style={{color:'#00bcd4',fontSize:28}} title="اتصال"><FaPhone /></a>
          <a href={contacts.facebook} target="_blank" rel="noopener noreferrer" style={{color:'#1877f3',fontSize:28}} title="فيسبوك"><FaFacebook /></a>
          <a href={contacts.snapchat} target="_blank" rel="noopener noreferrer" style={{color:'#fffc00',fontSize:28}} title="سناب شات"><FaSnapchatGhost /></a>
          <a href={contacts.twitter} target="_blank" rel="noopener noreferrer" style={{color:'#1da1f2',fontSize:28}} title="تويتر"><FaTwitter /></a>
          <a href={contacts.instagram} target="_blank" rel="noopener noreferrer" style={{color:'#e1306c',fontSize:28}} title="انستجرام"><FaInstagram /></a>
          <a href={contacts.telegram} target="_blank" rel="noopener noreferrer" style={{color:'#0088cc',fontSize:28}} title="تيليجرام"><FaTelegram /></a>
          <a href={contacts.discord} target="_blank" rel="noopener noreferrer" style={{color:'#5865f2',fontSize:28}} title="ديسكورد"><FaDiscord /></a>
          <a href={contacts.gmail} target="_blank" rel="noopener noreferrer" style={{color:'#00bcd4',fontSize:28}} title="Gmail"><FaEnvelope /></a>
        </div>
      )}
      <div style={{margin:'32px 0'}}>
        <StatsBox />
        <Reviews />
        <div style={{marginTop:32}}>
          <VideoTour />
        </div>
      </div>
    </div>
  );
}
