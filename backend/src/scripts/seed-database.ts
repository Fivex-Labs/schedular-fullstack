import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { CategoriesService } from '../services/categories.service';
import { ParticipantsService } from '../services/participants.service';

/**
 * Database Seeding Script
 * 
 * Populates the database with default categories and participants
 * Run with: npm run seed
 */
async function seedDatabase() {
  console.log('🌱 Starting database seeding...');
  
  const app = await NestFactory.createApplicationContext(AppModule);
  
  try {
    const categoriesService = app.get(CategoriesService);
    const participantsService = app.get(ParticipantsService);

    // Check if data already exists
    const existingCategories = await categoriesService.findAll();
    const existingParticipants = await participantsService.findAll();

    if (existingCategories.length === 0) {
      console.log('📂 Creating default categories...');
      const categories = await categoriesService.createDefaults();
      console.log(`✅ Created ${categories.length} categories`);
    } else {
      console.log(`📂 Found ${existingCategories.length} existing categories, skipping...`);
    }

    if (existingParticipants.length === 0) {
      console.log('👥 Creating default participants...');
      const participants = await participantsService.createDefaults();
      console.log(`✅ Created ${participants.length} participants`);
    } else {
      console.log(`👥 Found ${existingParticipants.length} existing participants, skipping...`);
    }

    console.log('🎉 Database seeding completed successfully!');
    
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  } finally {
    await app.close();
  }
}

// Run the seeding if this file is executed directly
if (require.main === module) {
  seedDatabase();
} 