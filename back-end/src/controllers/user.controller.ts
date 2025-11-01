import { Response } from "express";
import { User } from "../models/user.model";
import { Profile } from "../models/profile.model";
import { AuthRequest } from "@/middleware/auth.middleware";

export class UserController {
  static async getUserInfo(req: AuthRequest, res: Response) {
    try {
      const userId = req.user?.userId;
      
      const user = await User.findById(userId)
        .select("-password -refreshTokens -__v -_id")
        .populate({
          path: "profile",
          select: "-__v -createdAt -updatedAt -_id"
        });
      
      if (!user) {
        res.error("Not found", 404);
        return;
      }
      
      res.success(user);
    } catch (error: any) {
      console.error("Get user info error:", error);
      res.error("An error occurred", 500);
      return;
    }
  }

static async getProfile(req: AuthRequest, res: Response) {
  try {
    const userId = req.user?.userId;
    
    console.log('🔍 Getting profile for userId:', userId);
    
    let user = await User.findById(userId).populate('profile');
    
    console.log('👤 User found:', user ? 'YES' : 'NO');
    console.log('📋 User profile exists:', user?.profile ? 'YES' : 'NO');
    console.log('📋 Profile data:', JSON.stringify(user?.profile, null, 2));
    
    if (!user) {
      console.log('❌ User not found');
      res.error("User not found", 404);
      return;
    }
    
    // AUTO-CREATE PROFILE IF IT DOESN'T EXIST
    if (!user.profile) {
      console.log('🆕 Creating new profile...');
      const profile = await Profile.create({
        user: userId,
        firstName: '',
        lastName: '',
        email: user.email,
        bio: '',
        avatar: '',
        socials: {
          facebook: '',
          twitter: '',
          linkedIn: ''
        },
        verificationDocuments: {
          idCard: { url: '', verified: false },
          drivingLicense: { url: '', verified: false }
        },
        rating: {
          average: 0,
          count: 0
        }
      });
      
      console.log('✅ Profile created:', profile._id);
      
      user.profile = profile._id as any;
      await user.save();
      
      // Reload user with populated profile
      user = await User.findById(userId).populate('profile');
    }
    
    console.log('✅ Sending profile response');
    res.success(user?.profile);
  } catch (error: any) {
    console.error("❌ Get profile error:", error);
    res.error("An error occurred", 500);
    return;
  }
}

  static async updateProfile(req: AuthRequest, res: Response) {
    try {
      const userId = req.user?.userId;
      const {
        firstName,
        lastName,
        dateOfBirth,
        email,
        bio,
        avatar,
        socials,
        verificationDocuments
      } = req.body;
      
      const user = await User.findById(userId);
      
      if (!user) {
        res.error("User not found", 404);
        return;
      }
      
      let profile;
      
      if (user.profile) {
        profile = await Profile.findByIdAndUpdate(
          user.profile,
          {
            firstName,
            lastName,
            dateOfBirth,
            email,
            bio,
            avatar,
            socials,
            verificationDocuments
          },
          { new: true, runValidators: true }
        );
      } else {
        profile = await Profile.create({
          user: userId,
          firstName,
          lastName,
          dateOfBirth,
          email,
          bio,
          avatar,
          socials,
          verificationDocuments
        });
        
        user.profile = profile._id as any;
        await user.save();
      }
      
      res.success(profile);
    } catch (error: any) {
      console.error("Profile update error:", error);
      res.error(error.message || "An error occurred", 500);
      return;
    }
  }

  static async uploadAvatar(req: AuthRequest, res: Response) {
    try {
      const userId = req.user?.userId;
      const { avatar } = req.body;
      
      const user = await User.findById(userId);
      
      if (!user || !user.profile) {
        res.error("Profile not found", 404);
        return;
      }
      
      const profile = await Profile.findByIdAndUpdate(
        user.profile,
        { avatar },
        { new: true }
      );
      
      res.success(profile);
    } catch (error: any) {
      console.error("Upload avatar error:", error);
      res.error("An error occurred", 500);
      return;
    }
  }

  static async uploadFile(req: AuthRequest, res: Response) {
    try {
      if (!req.file) {
        res.error("No file uploaded", 400);
        return;
      }

      // NOTE: This converts the file to a base64 data URL as an interim solution.
      // For production, consider implementing cloud storage (e.g., AWS S3, Google Cloud Storage)
      // and returning a permanent URL instead of storing base64 in the database.
      // This approach has limitations:
      // - Increased database size and slower queries
      // - Larger payload sizes in API responses
      // - No CDN benefits for image delivery
      const base64 = req.file.buffer.toString('base64');
      const dataUrl = `data:${req.file.mimetype};base64,${base64}`;

      res.success({
        url: dataUrl,
        filename: req.file.originalname,
        mimetype: req.file.mimetype,
        size: req.file.size
      });
    } catch (error: any) {
      console.error("Upload file error:", error);
      res.error("An error occurred during file upload", 500);
      return;
    }
  }
}