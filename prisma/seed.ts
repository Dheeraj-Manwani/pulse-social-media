import { PrismaClient, MediaType, NotificationType } from "@prisma/client";
import { generateIdFromEntropySize } from "lucia";
import { hash } from "@node-rs/argon2";
import { UTApi } from "uploadthing/server";
import prisma from "@/lib/prisma";


// Helper function to extract username from email
function getUsernameFromEmail(email: string): string {
  return email.split("@")[0];
}

// Helper function to get display name from email
function getDisplayNameFromEmail(email: string): string {
  const username = email.split("@")[0];
  // Split by dots and capitalize each part
  return username
    .split(".")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}

// Indian names mapping for better display names
const indianNames: Record<string, string> = {
  "arjun.sharma": "Arjun Sharma",
  "priya.patel": "Priya Patel",
  "rahul.kumar": "Rahul Kumar",
  "kavya.reddy": "Kavya Reddy",
  "vikram.singh": "Vikram Singh",
  "ananya.desai": "Ananya Desai",
  "rohan.mehta": "Rohan Mehta",
  "isha.gupta": "Isha Gupta",
};

// Sample post contents
const samplePosts = [
  "Just launched my new project! 🚀 Excited to share it with everyone. #coding #webdev",
  "Beautiful sunset today 🌅 Sometimes you just need to stop and appreciate the moment.",
  "Working on something exciting! Can't wait to share more details soon. Stay tuned! 💫",
  "Coffee and code ☕ The perfect combination for a productive day.",
  "Just learned something new today! Always keep learning and growing. 📚",
  "Weekend vibes! Time to relax and recharge. What are you all up to? 😊",
  "New feature coming soon! Working hard to make it perfect. 🎨",
  "Grateful for this amazing community! Thanks for all the support. 🙏",
  "Debugging is like being a detective in a crime movie where you're also the murderer 🕵️",
  "Code review time! Always learning from the team. Great collaboration! 👥",
  "Morning run complete! 🏃‍♂️ Nothing beats starting the day with some exercise.",
  "Found this amazing coffee shop downtown. The vibes are immaculate! ☕✨",
  "Working on a side project that I'm really passionate about. Can't wait to show you all! 💻",
  "Just finished reading an incredible book. Highly recommend! 📖",
  "Team meeting went great today! Love working with such talented people. 🤝",
  "Trying out a new recipe tonight. Wish me luck! 🍳",
  "The weather is perfect today! Perfect time for a walk in the park. 🌳",
  "Just discovered a new music artist. This album is fire! 🎵🔥",
  "Weekend project: Building something cool. Stay tuned for updates! 🛠️",
  "Grateful for all the opportunities coming my way. Life is good! 🙏",
  "Just hit a personal milestone! Celebrating the small wins. 🎉",
  "Working late tonight but it's worth it. Passion projects never feel like work! 💪",
  "Found an amazing new podcast. Learning so much! 🎧",
  "Weekend plans: Code, coffee, and chill. Perfect combination! ☕💻",
  "Just had the best conversation with a friend. Good talks are everything! 💬",
  "Working on improving my skills. Growth mindset all the way! 📈",
  "Beautiful day outside! Sometimes you need to step away from the screen. 🌞",
  "New ideas flowing today! Creativity is in the air. ✨",
  "Just completed a challenging task. Feeling accomplished! ✅",
  "Weekend vibes hitting different today. Time to recharge! 🔋",
  "Working on something that excites me. Passion is the best fuel! 🔥",
  "Life update: Things are looking up! Grateful for the journey. 🌟",
];

// Sample comments
const sampleComments = [
  "This is amazing! Great work! 👏",
  "Love this! Keep it up! 💪",
  "Interesting perspective! Thanks for sharing.",
  "Can't wait to see more! 🔥",
  "This is exactly what I needed! Thank you!",
  "Awesome! Looking forward to updates.",
  "Great job! Really inspiring! ✨",
  "This is so cool! Well done! 🎉",
];

// Helper function to fetch a random photo from Picsum Photos
async function fetchRandomPhoto(
  width: number = 800,
  height: number = 600,
): Promise<File> {
  // Use Picsum Photos API to get random images
  const imageId = Math.floor(Math.random() * 1000); // Random image ID
  const url = `https://picsum.photos/${width}/${height}?random=${imageId}`;
  
  console.log(`  📥 Fetching random photo from ${url}...`);
  
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch image: ${response.statusText}`);
    }
    
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const uint8Array = new Uint8Array(buffer);
    
    // Determine content type from response
    const contentType = response.headers.get("content-type") || "image/jpeg";
    const extension = contentType.includes("jpeg") ? "jpg" : "png";
    
    const blob = new Blob([uint8Array], { type: contentType });
    
    return new File([blob], `random-photo-${Date.now()}-${imageId}.${extension}`, {
      type: contentType,
    });
  } catch (error) {
    console.error(`  ⚠️  Failed to fetch random photo, using fallback:`, error);
    // Fallback: create a simple colored image
    return createFallbackImage(width, height);
  }
}

// Helper function to fetch a random avatar image (square, smaller size)
async function fetchRandomAvatar(size: number = 400): Promise<File> {
  // Use Picsum Photos API to get random square images for avatars
  const imageId = Math.floor(Math.random() * 1000); // Random image ID
  const url = `https://picsum.photos/${size}/${size}?random=${imageId}`;
  
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch avatar: ${response.statusText}`);
    }
    
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const uint8Array = new Uint8Array(buffer);
    
    const contentType = response.headers.get("content-type") || "image/jpeg";
    const extension = contentType.includes("jpeg") ? "jpg" : "png";
    
    const blob = new Blob([uint8Array], { type: contentType });
    
    return new File([blob], `avatar-${Date.now()}-${imageId}.${extension}`, {
      type: contentType,
    });
  } catch (error) {
    console.error(`  ⚠️  Failed to fetch random avatar, using fallback:`, error);
    // Fallback: create a simple colored square image
    return createFallbackImage(size, size);
  }
}

// Fallback function to create a simple image if fetching fails
function createFallbackImage(
  width: number = 800,
  height: number = 600,
): File {
  const svg = `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#6366f1;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#8b5cf6;stop-opacity:1" />
        </linearGradient>
      </defs>
      <rect width="100%" height="100%" fill="url(#grad)"/>
      <text x="50%" y="50%" font-family="Arial" font-size="48" fill="white" text-anchor="middle" dominant-baseline="middle">Pulse</text>
    </svg>
  `.trim();

  const buffer = Buffer.from(svg, "utf-8");
  const uint8Array = new Uint8Array(buffer);
  const blob = new Blob([uint8Array], { type: "image/svg+xml" });
  
  return new File([blob], `fallback-${Date.now()}.svg`, {
    type: "image/svg+xml",
  });
}

// Helper function to upload file to UploadThing
async function uploadToUploadThing(
  file: File,
  utApi: UTApi,
): Promise<string> {
  console.log(`  📤 Uploading ${file.name} to UploadThing...`);
  
  try {
    const response = await utApi.uploadFiles(file);
    
    // UTApi.uploadFiles returns an array of results
    const result = Array.isArray(response) ? response[0] : response;
    
    if (!result || !result.data || !result.data.url) {
      throw new Error("Upload failed: No URL returned");
    }

    // Transform URL from /f/ to /a/{APP_ID}/ format (as done in the app)
    const appId = process.env.NEXT_PUBLIC_UPLOADTHING_APP_ID;
    if (!appId) {
      throw new Error("NEXT_PUBLIC_UPLOADTHING_APP_ID is not set");
    }

    const transformedUrl = result.data.url.replace("/f/", `/a/${appId}/`);
    console.log(`  ✅ Uploaded successfully: ${transformedUrl}`);
    
    return transformedUrl;
  } catch (error) {
    console.error(`  ❌ Upload failed for ${file.name}:`, error);
    throw error;
  }
}

async function main() {
  console.log("🌱 Starting database seed...\n");
  console.log("ℹ️  Note: All users will have password 'password123' for testing\n");

  // Clear existing data (optional - comment out if you want to keep existing data)
  console.log("🧹 Cleaning existing data...");
  await prisma.notification.deleteMany();
  await prisma.bookmark.deleteMany();
  await prisma.like.deleteMany();
  await prisma.comment.deleteMany();
  await prisma.media.deleteMany();
  await prisma.post.deleteMany();
  await prisma.follow.deleteMany();
  await prisma.session.deleteMany();
  await prisma.user.deleteMany();
  console.log("✅ Existing data cleaned\n");

  // User emails with Indian names
  const userEmails = [
    "arjun.sharma@gmail.com",
    "priya.patel@gmail.com",
    "rahul.kumar@gmail.com",
    "kavya.reddy@gmail.com",
    "vikram.singh@gmail.com",
    "ananya.desai@gmail.com",
    "rohan.mehta@gmail.com",
    "isha.gupta@gmail.com",
  ];

  // Create users
  console.log("👥 Creating users...");
  const users = [];
  const passwordHash = await hash("password123", {
    memoryCost: 19456,
    timeCost: 2,
    outputLen: 32,
    parallelism: 1,
  });

  // Check if UploadThing is configured for avatar uploads
  let utApi: UTApi | null = null;
  if (process.env.UPLOADTHING_SECRET) {
    utApi = new UTApi();
  }

  for (const email of userEmails) {
    const userId = generateIdFromEntropySize(10);
    const username = getUsernameFromEmail(email);
    // Use the Indian names mapping if available, otherwise use the generated name
    const displayName = indianNames[username] || getDisplayNameFromEmail(email);

    let avatarUrl: string | null = null;

    // Upload avatar image if UploadThing is configured
    if (utApi && process.env.NEXT_PUBLIC_UPLOADTHING_APP_ID) {
      try {
        console.log(`  📤 Uploading avatar for ${displayName}...`);
        const avatarFile = await fetchRandomAvatar(400);
        const uploadedUrl = await uploadToUploadThing(avatarFile, utApi);
        avatarUrl = uploadedUrl;
        console.log(`  ✅ Avatar uploaded for ${displayName}`);
      } catch (error) {
        console.error(
          `  ⚠️  Failed to upload avatar for ${displayName}:`,
          error instanceof Error ? error.message : error,
        );
        // Continue without avatar if upload fails
      }
    }

    const user = await prisma.user.create({
      data: {
        id: userId,
        username,
        displayName,
        email,
        passwordHash,
        bio: `Namaste! I'm ${displayName}. Welcome to my profile! 👋`,
        avatarUrl,
      },
    });

    users.push(user);
    console.log(`  ✅ Created user: ${displayName} (@${username}) - ${email}`);
  }
  console.log(`✅ Created ${users.length} users\n`);

  // Create follows (create a network of follows between all 8 users)
  console.log("🔗 Creating follow relationships...");
  const followPairs = [
    { follower: 0, following: 1 }, // Arjun follows Priya
    { follower: 0, following: 2 }, // Arjun follows Rahul
    { follower: 1, following: 0 }, // Priya follows Arjun
    { follower: 1, following: 3 }, // Priya follows Kavya
    { follower: 2, following: 0 }, // Rahul follows Arjun
    { follower: 2, following: 4 }, // Rahul follows Vikram
    { follower: 3, following: 1 }, // Kavya follows Priya
    { follower: 3, following: 5 }, // Kavya follows Ananya
    { follower: 4, following: 2 }, // Vikram follows Rahul
    { follower: 4, following: 6 }, // Vikram follows Rohan
    { follower: 5, following: 3 }, // Ananya follows Kavya
    { follower: 5, following: 7 }, // Ananya follows Isha
    { follower: 6, following: 4 }, // Rohan follows Vikram
    { follower: 6, following: 0 }, // Rohan follows Arjun
    { follower: 7, following: 5 }, // Isha follows Ananya
    { follower: 7, following: 1 }, // Isha follows Priya
  ];

  const follows = [];
  for (const follow of followPairs) {
    await prisma.follow.create({
      data: {
        followerId: users[follow.follower].id,
        followingId: users[follow.following].id,
      },
    });
    follows.push(follow);
    console.log(
      `  ✅ ${users[follow.follower].displayName} → ${users[follow.following].displayName}`,
    );
  }
  console.log(`✅ Created ${follows.length} follow relationships\n`);

  // Create posts
  console.log("📝 Creating posts...");
  const posts = [];
  const totalPosts = 100;
  const postsPerUser = Math.floor(totalPosts / users.length); // Distribute posts evenly
  const extraPosts = totalPosts % users.length; // Remaining posts to distribute

  let postIndex = 0;
  for (let i = 0; i < users.length; i++) {
    const user = users[i];
    // Distribute extra posts to first few users
    const userPostCount = postsPerUser + (i < extraPosts ? 1 : 0);
    
    for (let j = 0; j < userPostCount; j++) {
      const postContent = samplePosts[postIndex % samplePosts.length];
      const createdAt = new Date();
      // Stagger posts over the past week
      createdAt.setHours(
        createdAt.getHours() - (totalPosts - postIndex) * 1.5,
      );

      const post = await prisma.post.create({
        data: {
          content: postContent,
          userId: user.id,
          createdAt,
        },
      });

      posts.push(post);
      postIndex++;
      console.log(
        `  ✅ Created post ${postIndex}/${totalPosts} by ${user.displayName}: "${postContent.substring(0, 50)}..."`,
      );
    }
  }
  console.log(`✅ Created ${posts.length} posts\n`);

  // Create media attachments for some posts
  console.log("🖼️  Creating media attachments...");
  
  let mediaCount = 0;
  
  // Check if UploadThing is configured
  if (!process.env.UPLOADTHING_SECRET) {
    console.log("  ⚠️  UPLOADTHING_SECRET not set, skipping media uploads");
    console.log("  ℹ️  Set UPLOADTHING_SECRET and NEXT_PUBLIC_UPLOADTHING_APP_ID to upload media\n");
  } else {
    // Use the UTApi instance created earlier, or create new one if not available
    if (!utApi) {
      utApi = new UTApi();
    }
    // Upload images for exactly 50 posts (50% of posts will have images)
    const maxMedia = 50;
    // Randomly select which posts will have images
    const postsWithImages = posts
      .sort(() => Math.random() - 0.5)
      .slice(0, maxMedia);

    console.log(`  📸 Uploading images for ${maxMedia} randomly selected posts...\n`);

    for (let i = 0; i < postsWithImages.length; i++) {
      const post = postsWithImages[i];
      const postAuthor = users.find((u) => u.id === post.userId);
      
      try {
        // Fetch a random photo from Picsum Photos
        const imageFile = await fetchRandomPhoto(800, 600);
        
        // Upload to UploadThing
        const uploadedUrl = await uploadToUploadThing(imageFile, utApi);
        
        // Create media record with the uploaded URL
        await prisma.media.create({
          data: {
            postId: post.id,
            type: MediaType.IMAGE,
            url: uploadedUrl,
          },
        });

        mediaCount++;
        console.log(
          `  ✅ [${i + 1}/${maxMedia}] Added image to post by ${postAuthor?.displayName || "user"}`,
        );
      } catch (error) {
        console.error(
          `  ❌ Failed to upload media for post ${post.id}:`,
          error instanceof Error ? error.message : error,
        );
        // Continue with other posts even if one fails
      }
    }
    
    console.log(`✅ Created ${mediaCount} media attachments\n`);
  }

  // Create likes
  console.log("❤️  Creating likes...");
  let likeCount = 0;
  for (const post of posts) {
    // Each post gets liked by 1-3 random users
    const likers = users
      .filter((u) => u.id !== post.userId)
      .sort(() => Math.random() - 0.5)
      .slice(0, Math.floor(Math.random() * 3) + 1);

    for (const liker of likers) {
      await prisma.like.create({
        data: {
          userId: liker.id,
          postId: post.id,
        },
      });
      likeCount++;
    }
    console.log(
      `  ✅ Post "${post.content.substring(0, 30)}..." got ${likers.length} like(s)`,
    );
  }
  console.log(`✅ Created ${likeCount} likes\n`);

  // Create comments
  console.log("💬 Creating comments...");
  let commentCount = 0;
  for (const post of posts.slice(0, posts.length - 1)) {
    // Each post gets 1-2 comments
    const commenters = users
      .filter((u) => u.id !== post.userId)
      .sort(() => Math.random() - 0.5)
      .slice(0, Math.floor(Math.random() * 2) + 1);

    for (const commenter of commenters) {
      const commentContent =
        sampleComments[commentCount % sampleComments.length];
      await prisma.comment.create({
        data: {
          content: commentContent,
          userId: commenter.id,
          postId: post.id,
        },
      });
      commentCount++;
      console.log(
        `  ✅ ${commenter.displayName} commented on post: "${commentContent}"`,
      );
    }
  }
  console.log(`✅ Created ${commentCount} comments\n`);

  // Create bookmarks
  console.log("🔖 Creating bookmarks...");
  let bookmarkCount = 0;
  for (const user of users) {
    // Each user bookmarks 1-2 random posts
    const bookmarkedPosts = posts
      .filter((p) => p.userId !== user.id)
      .sort(() => Math.random() - 0.5)
      .slice(0, Math.floor(Math.random() * 2) + 1);

    for (const post of bookmarkedPosts) {
      await prisma.bookmark.create({
        data: {
          userId: user.id,
          postId: post.id,
        },
      });
      bookmarkCount++;
    }
    console.log(
      `  ✅ ${user.displayName} bookmarked ${bookmarkedPosts.length} post(s)`,
    );
  }
  console.log(`✅ Created ${bookmarkCount} bookmarks\n`);

  // Create notifications
  console.log("🔔 Creating notifications...");
  let notificationCount = 0;

  // LIKE notifications
  const likes = await prisma.like.findMany();
  for (const like of likes.slice(0, 5)) {
    const post = posts.find((p) => p.id === like.postId);
    if (post && like.userId !== post.userId) {
      await prisma.notification.create({
        data: {
          recipientId: post.userId,
          issuerId: like.userId,
          postId: post.id,
          type: NotificationType.LIKE,
        },
      });
      notificationCount++;
    }
  }

  // COMMENT notifications
  const comments = await prisma.comment.findMany();
  for (const comment of comments.slice(0, 5)) {
    const post = posts.find((p) => p.id === comment.postId);
    if (post && comment.userId !== post.userId) {
      await prisma.notification.create({
        data: {
          recipientId: post.userId,
          issuerId: comment.userId,
          postId: post.id,
          type: NotificationType.COMMENT,
        },
      });
      notificationCount++;
    }
  }

  // FOLLOW notifications
  for (const follow of follows.slice(0, 4)) {
    await prisma.notification.create({
      data: {
        recipientId: users[follow.following].id,
        issuerId: users[follow.follower].id,
        type: NotificationType.FOLLOW,
      },
    });
    notificationCount++;
  }

  console.log(`✅ Created ${notificationCount} notifications\n`);

  // Summary
  console.log("📊 Seed Summary:");
  console.log(`  👥 Users: ${users.length}`);
  console.log(`  🔗 Follows: ${follows.length}`);
  console.log(`  📝 Posts: ${posts.length}`);
  console.log(`  🖼️  Media: ${mediaCount}`);
  console.log(`  ❤️  Likes: ${likeCount}`);
  console.log(`  💬 Comments: ${commentCount}`);
  console.log(`  🔖 Bookmarks: ${bookmarkCount}`);
  console.log(`  🔔 Notifications: ${notificationCount}`);
  console.log("\n✅ Database seed completed successfully! 🎉");
}

main()
  .catch((e) => {
    console.error("❌ Error seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
