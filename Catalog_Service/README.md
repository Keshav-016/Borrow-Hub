You are assisting in building a production-ready Catalog Service for a microservice-based project called ToolLib.

Tech Stack:
- NestJS (Controllers, Modules, Providers, Exception filters)
- Prisma ORM (PostgreSQL)
- REST APIs, DTO validation with class-validator
- Services must be clean, modular, SOLID
- No business logic inside controllers

---------------------------------------------
📦 Catalog Service Requirements
---------------------------------------------

The Catalog Service manages all lendable items in the ToolLib platform.  
It exposes CRUD APIs for items, images, and availability slots, and supports geo-based queries.

---------------------------------------------
🧩 Prisma Schema (Important)
---------------------------------------------
Use this schema inside `schema.prisma`:

model Item {
  id               String          @id @default(uuid())
  ownerUserId      String
  title            String
  description      String?
  categoryId       String?
  pricePerHour     Decimal?        @db.Decimal(10, 2)
  pricePerDay      Decimal?        @db.Decimal(10, 2)
  securityDeposit  Decimal?        @db.Decimal(10, 2)
  conditionTag     ConditionTag    @default(GOOD)
  status           ItemStatus      @default(AVAILABLE)
  latitude         Float?
  longitude        Float?
  address          String?
  city             String?
  state            String?
  pincode          String?
  ratingAverage    Float?          @default(0)
  totalRatings     Int?            @default(0)
  images           ItemImage[]
  availability     ItemAvailability[]
  category         ItemCategory?   @relation(fields: [categoryId], references: [id])
  createdAt        DateTime        @default(now())
  updatedAt        DateTime        @updatedAt
}

model ItemImage {
  id          String   @id @default(uuid())
  itemId      String
  imageUrl    String
  uploadedAt  DateTime @default(now())
  item        Item     @relation(fields: [itemId], references: [id], onDelete: Cascade)
}

model ItemAvailability {
  id          String    @id @default(uuid())
  itemId      String
  startTime   DateTime
  endTime     DateTime
  isBooked    Boolean   @default(false)
  item        Item      @relation(fields: [itemId], references: [id], onDelete: Cascade)
}

model ItemCategory {
  id          String    @id @default(uuid())
  name        String    @unique
  description String?
  iconUrl     String?
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
  items       Item[]
}

---------------------------------------------
🎯 Features to Implement (Copilot must generate)
---------------------------------------------

1. **Item CRUD**
   - createItem()
   - updateItem()
   - deleteItem() = soft delete (set status = DELETED)
   - getItemById()
   - listItemsByOwnerId()

2. **Geo-based Item Search**
   - findNearbyItems(lat, lon, radiusKm)
   - This must use raw SQL with Haversine formula inside Prisma

3. **Item Images**
   - addImagesToItem(itemId, images)
   - deleteImage(imageId)
   - listImages(itemId)

4. **Availability Slots**
   - addAvailability(itemId, startTime, endTime)
   - blockAvailabilityDuringBorrow(borrowStart, borrowEnd)
   - listAvailability(itemId)

5. **DTOs + Validation**
   - CreateItemDto
   - UpdateItemDto
   - GeoSearchDto
   - AddImageDto
   - CreateAvailabilityDto

Use:
- class-validator decorators (@IsString, @IsNumber, @IsOptional, @IsUUID, etc.)
- Swagger decorators (@ApiProperty)

6. **Controllers**
   - ItemController → /items
   - ImageController → /items/:itemId/images
   - AvailabilityController → /items/:itemId/availability

7. **Modules**
   - CatalogModule
   - import PrismaModule
   - export CatalogService

8. **Clean Service Logic**
   - Use dependency-injected Prisma client
   - Throw meaningful exceptions:
     - NotFoundException
     - BadRequestException
   - No business logic in controllers

---------------------------------------------
⚙️ Controller Output Requirements
---------------------------------------------
Copilot must generate:
- Fully working controllers
- Proper routing: @Get(), @Post(), @Patch(), @Delete()
- DTO validation pipes
- Proper HTTP status codes (201, 200, 204)

---------------------------------------------
📡 Geo-search SQL (Copilot must reuse)
---------------------------------------------

Use this raw SQL query in Prisma:
SELECT *, (
  6371 * acos(
    cos(radians($lat)) *
    cos(radians(latitude)) *
    cos(radians(longitude) - radians($lon)) +
    sin(radians($lat)) *
    sin(radians(latitude))
  )
) AS distance
FROM "Item"
WHERE status = 'AVAILABLE'
HAVING distance < $radius
ORDER BY distance ASC;

---------------------------------------------
🧾 Expected Result
---------------------------------------------
Copilot should auto-generate:

- catalog.module.ts
- item.service.ts
- item.controller.ts
- dto/create-item.dto.ts
- dto/update-item.dto.ts
- dto/geo-search.dto.ts
- dto/create-availability.dto.ts
- dto/add-image.dto.ts
- image.service.ts
- image.controller.ts
- availability.service.ts
- availability.controller.ts
- prisma service integration

All code should follow NestJS best practices.

---------------------------------------------
Now generate the complete CatalogService following this spec.
