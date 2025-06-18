import React, { useEffect, useState } from 'react';
import styles from '../styles/AnimatedBackground.module.css';

// البحث تلقائياً عن كل صور الخلفية من bg1 إلى bg10 بامتداد png أو jpg
const bgImages: string[] = [];
for (let i = 1; i <= 10; i++) {
  if (typeof window !== 'undefined') {
    // لا يمكن التحقق من وجود الملف فعلياً في وقت البناء، لكن سنحاول كل الاحتمالات
  }
  bgImages.push(`/images/bg${i}.png`);
  bgImages.push(`/images/bg${i}.jpg`);
  // أيضاً دعم الصور في public مباشرة
  bgImages.push(`/bg${i}.png`);
  bgImages.push(`/bg${i}.jpg`);
}

export default function AnimatedBackground() {
  const [index, setIndex] = useState(0);
  const [availableImages, setAvailableImages] = useState<string[]>([]);

  useEffect(() => {
    // فلترة الصور التي تعمل فعلياً
    const testImages = async () => {
      const valid: string[] = [];
      for (const src of bgImages) {
        try {
          await new Promise((resolve, reject) => {
            const img = new window.Image();
            img.src = src;
            img.onload = () => resolve(true);
            img.onerror = () => reject();
          });
          valid.push(src);
        } catch {}
      }
      setAvailableImages(valid);
    };
    testImages();
  }, []);

  useEffect(() => {
    if (availableImages.length === 0) return;
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % availableImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [availableImages]);

  if (availableImages.length === 0) return null;
  return (
    <div className={styles.animatedBg} style={{ backgroundImage: `url(${availableImages[index]})` }} />
  );
}
