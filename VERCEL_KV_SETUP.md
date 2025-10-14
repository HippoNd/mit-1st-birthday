# 🚀 Vercel KV Setup Guide

## ✅ Đã hoàn thành:
- ✅ Loại bỏ lowdb hoàn toàn
- ✅ Chuyển sang Vercel KV
- ✅ Database hoạt động trên local development
- ✅ Tất cả API routes đã được cập nhật

## 🔧 Setup Vercel KV trên Vercel Dashboard:

### Bước 1: Tạo KV Database
1. Vào [Vercel Dashboard](https://vercel.com/dashboard)
2. Chọn project của bạn
3. Vào tab **Storage**
4. Click **Create Database**
5. Chọn **KV** (Redis)
6. Đặt tên: `rsvp-database`
7. Click **Create**

### Bước 2: Environment Variables
Vercel sẽ tự động thêm các biến môi trường:
- `KV_REST_API_URL`
- `KV_REST_API_TOKEN` 
- `KV_REST_API_READ_ONLY_TOKEN`
- `KV_URL`

### Bước 3: Deploy
```bash
git add .
git commit -m "Switch to Vercel KV database"
git push
```

## 🎯 Lợi ích:

### ✅ **Local Development:**
- Sử dụng in-memory store (nhanh)
- Dữ liệu persist trong session
- Không cần setup gì thêm

### ✅ **Vercel Production:**
- Sử dụng Redis (cực kỳ nhanh)
- Dữ liệu persistent
- Miễn phí 30,000 requests/tháng
- Tích hợp sẵn với Vercel

## 🧪 Test:

### Local Development:
```bash
# Test thêm guest
curl -X POST "http://localhost:3000/api/guests" \
  -H "Content-Type: application/json" \
  -d '{"name": "Test Guest"}'

# Test RSVP
curl -X POST "http://localhost:3000/api/rsvp/invite/INVITE_CODE" \
  -H "Content-Type: application/json" \
  -d '{"isAttending": true}'
```

### Production (sau khi deploy):
```bash
# Test trên Vercel
curl -X POST "https://your-app.vercel.app/api/guests" \
  -H "Content-Type: application/json" \
  -d '{"name": "Test Guest"}'
```

## 📊 Database Schema:

```typescript
interface DatabaseSchema {
  guests: GuestInvitation[]
  rsvps: RSVPData[]
}

interface GuestInvitation {
  id: string
  name: string
  inviteCode: string
  isInvited: boolean
  createdAt: string
}

interface RSVPData {
  id: string
  guestId: string
  guestName: string
  isAttending: boolean
  submittedAt: string
}
```

## 🔄 Migration từ lowdb:

- ✅ Tất cả API routes đã được cập nhật
- ✅ Database functions giữ nguyên interface
- ✅ Không cần thay đổi frontend code
- ✅ Tương thích hoàn toàn với hệ thống hiện tại

## 🎉 Kết quả:

- **Local**: Hoạt động với in-memory store
- **Vercel**: Hoạt động với Redis KV
- **Performance**: Nhanh hơn lowdb
- **Reliability**: Ổn định hơn trên Vercel
- **Cost**: Miễn phí với Vercel KV

---

**Lưu ý**: Sau khi setup Vercel KV, dữ liệu sẽ được lưu trữ persistent trên Redis thay vì file system. Điều này đảm bảo ứng dụng hoạt động ổn định trên Vercel production.