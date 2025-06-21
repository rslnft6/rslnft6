import React, { useState } from 'react';
import { searchPropertiesInText } from '../services/smartChatSearch';

// نموذج دردشة ذكية مجاني (يعتمد على نموذج مفتوح المصدر من HuggingFace)
const HF_API = 'https://api-inference.huggingface.co/models/microsoft/DialoGPT-medium';

const SmartChat: React.FC = () => {
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;
    setMessages([...messages, { from: 'user', text: input }]);
    setLoading(true);
    // بحث داخلي عن العقارات إذا كان السؤال عقاري
    const results = searchPropertiesInText(input);
    if (results.length > 0) {
      const reply = `وجدت ${results.length} عقار/وحدة:
` + results.map(r => `• ${r.title} (${r.location}) - ${r.status}`).join('\n');
      setMessages(msgs => [...msgs, { from: 'bot', text: reply }]);
      setInput('');
      setLoading(false);
      return;
    }
    // إذا لم يكن السؤال عقاري، رد افتراضي بسيط
    setMessages(msgs => [...msgs, { from: 'bot', text: 'شكرًا لسؤالك! يمكنك البحث عن عقار بكتابة نوع العقار أو المدينة (مثال: شقة في الشيخ زايد).' }]);
    setInput('');
    setLoading(false);
  };

  return (
    <div style={{background:'#fff',borderRadius:16,padding:16,boxShadow:'0 2px 12px #e0e0e0',margin:'32px 0',maxWidth:400,marginLeft:'auto',marginRight:'auto'}}>
      {/* <h3 style={{color:'#00bcd4',marginBottom:8}}>الدردشة الذكية المجانية</h3> */}
      <div style={{minHeight:80,maxHeight:200,overflowY:'auto',marginBottom:8}}>
        {messages.map((m,i) => (
          <div key={i} style={{textAlign:m.from==='user'?'right':'left',margin:'4px 0'}}>
            <span style={{
              background:m.from==='user'? '#e0f7fa':'#f5f7fa',
              padding:'6px 12px',
              borderRadius:8,
              display:'inline-block',
              color:'#111'
            }}>{m.text}</span>
          </div>
        ))}
        {loading && <div style={{color:'#888'}}>...جاري الرد</div>}
      </div>
      <div style={{display:'flex',gap:8}}>
        <input value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==='Enter'&&sendMessage()} placeholder="اكتب سؤالك..." style={{flex:1,padding:8,borderRadius:8,border:'1px solid #b6c6e6'}} />
        <button onClick={sendMessage} disabled={loading} style={{background:'#00bcd4',color:'#fff',border:'none',borderRadius:8,padding:'8px 16px',fontWeight:'bold'}}>إرسال</button>
      </div>
      {/* <div style={{color:'#888',fontSize:12,marginTop:8}}>الدردشة تعتمد على نموذج مجاني مفتوح المصدر من HuggingFace.</div> */}
    </div>
  );
};

export default SmartChat;
