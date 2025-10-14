# 🚀 Redis Setup Guide

## ✅ Đã hoàn thành:
- ✅ Chuyển từ Vercel KV sang Redis client
- ✅ Sử dụng `redis` package với `REDIS_URL`
- ✅ Database hoạt động trên local development (in-memory)
- ✅ Tất cả API routes đã được cập nhật

## 🔧 Setup Redis trên Vercel:

### Bước 1: Tạo Redis Database
1. Vào [Vercel Dashboard](https://vercel.com/dashboard)
2. Chọn project của bạn
3. Vào tab **Storage**
4. Click **Create Database**
5. Chọn **Redis**
6. Đặt tên: `rsvp-database`
7. Click **Create**

### Bước 2: Environment Variables
Vercel sẽ tự động thêm biến môi trường:
- `REDIS_URL` - URL kết nối Redis

### Bước 3: Deploy
```bash
git add .
git commit -m "Switch to Redis database"
git push
```

## 🎯 Cách hoạt động:

### ✅ **Local Development:**
- Sử dụng in-memory store (nhanh)
- Dữ liệu persist trong session
- Không cần setup gì thêm
- Không cần `REDIS_URL`

### ✅ **Vercel Production:**
- Sử dụng Redis (cực kỳ nhanh)
- Dữ liệu persistent
- Tự động kết nối khi có `REDIS_URL`
- Fallback về in-memory nếu lỗi

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

## 🎉 Lợi ích:

- **Local**: Hoạt động với in-memory store
- **Vercel**: Hoạt động với Redis
- **Performance**: Nhanh hơn lowdb
- **Reliability**: Ổn định hơn trên Vercel
- **Cost**: Miễn phí với Vercel Redis
- **Flexibility**: Có thể sử dụng Redis provider khác

## 🔧 Code Implementation:

```typescript
// Database tự động detect environment
const hasRedisUrl = !!process.env.REDIS_URL

// Local development: in-memory store
// Production: Redis với REDIS_URL
const getData = async (): Promise<DatabaseSchema> => {
  if (hasRedisUrl && process.env.REDIS_URL) {
    // Sử dụng Redis
    const redis = await getRedisClient()
    const data = await redis.get('rsvp-database')
    return data ? JSON.parse(data) : { guests: [], rsvps: [] }
  }
  // Sử dụng in-memory store
  return getLocalStore()
}
```

---

**Lưu ý**: Sau khi setup Redis trên Vercel, dữ liệu sẽ được lưu trữ persistent trên Redis thay vì file system. Điều này đảm bảo ứng dụng hoạt động ổn định trên Vercel production.
