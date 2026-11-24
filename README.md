# ลอยกระทงออนไลน์ (เซิร์ฟเวอร์เดียว ใครมีลิงก์ก็เล่นด้วยกันได้)

ไฟล์ในโฟลเดอร์นี้:
- `index.html` คือหน้าเว็บเกม
- `worker.js` คือเซิร์ฟเวอร์ ใช้ Cloudflare Worker + Durable Object เป็นแม่น้ำสายเดียวที่ทุกคนเข้ามาเจอกัน
- `wrangler.toml` คือการตั้งค่าสำหรับ deploy

## วิธีติดตั้งจากมือถือ (ไม่ต้องใช้คอม)
1. แตกไฟล์ zip ในแอป My Files
2. สมัคร GitHub ที่ github.com สร้าง repository ใหม่ (ตั้งเป็น Public หรือ Private ก็ได้)
3. ในหน้า repository กด Add file > Upload files แล้วเลือกไฟล์ทั้ง 5 ไฟล์ในโฟลเดอร์ แล้วกด Commit changes
4. สมัครหรือล็อกอิน Cloudflare ที่ dash.cloudflare.com
5. ไปที่ Workers & Pages > Create application > Import a repository
6. เชื่อมบัญชี GitHub เลือก repository ที่เพิ่งสร้าง แล้วกด Save and Deploy
7. รอจนเสร็จ จะได้ลิงก์ .workers.dev ส่งให้เพื่อนได้เลย

## วิธีติดตั้งจากคอมพิวเตอร์
1. ติดตั้ง Node.js จาก https://nodejs.org (เลือกรุ่น LTS)
2. แตกไฟล์ zip แล้วเปิด Terminal (Mac) หรือ Command Prompt (Windows) ในโฟลเดอร์ `loy-krathong`
3. พิมพ์ `npm install`
4. พิมพ์ `npx wrangler login` เบราว์เซอร์จะเปิดหน้า Cloudflare ให้สมัครฟรีหรือล็อกอิน แล้วกดอนุญาต
5. พิมพ์ `npx wrangler deploy`
6. เมื่อเสร็จจะได้ลิงก์ประมาณ `https://loy-krathong.<ชื่อของคุณ>.workers.dev` ส่งลิงก์นี้ให้เพื่อนได้เลย

## แก้ไขภายหลัง
แก้ `index.html` แล้วพิมพ์ `npx wrangler deploy` อีกครั้ง

## หมายเหตุ
- ทุกคนที่เปิดลิงก์อยู่ในแม่น้ำสายเดียวกัน รองรับพร้อมกันได้สูงสุด 150 คน (แก้ได้ที่ `MAX_PLAYERS` ใน worker.js)
- เซิร์ฟเวอร์ไม่เก็บข้อมูลถาวร ปิดหน้าแล้วตัวละครหายไป ประวัติกระทงเก็บในเครื่องของแต่ละคน
