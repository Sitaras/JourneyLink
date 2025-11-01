"use client";

import React, { useState, useEffect } from 'react';
import { Star, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from "@/components/ui/separator";
import { getProfile, updateProfile } from '@/app/actions/profile.actions';
import { uploadFile } from '@/app/actions/upload.actions';

interface SocialLinks {
  facebook: string;
  twitter: string;
  linkedIn: string;
}

interface VerificationDocuments {
  idCard: {
    url: string;
    verified: boolean;
  };
  drivingLicense: {
    url: string;
    verified: boolean;
  };
}

const JourneyLinkProfile: React.FC = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [bio, setBio] = useState('');
  const [avatar, setAvatar] = useState<string>('');
  const [socialLinks, setSocialLinks] = useState<SocialLinks>({
    facebook: '',
    twitter: '',
    linkedIn: ''
  });
  const [verificationDocuments, setVerificationDocuments] = useState<VerificationDocuments>({
    idCard: { url: '', verified: false },
    drivingLicense: { url: '', verified: false }
  });
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  // Mock rating data
  const rating = {
    average: 4.8,
    count: 120
  };

  // Fetch profile data on mount
  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        console.log('📥 Fetching profile...');
        const profileData = await getProfile();
        
        console.log('✅ Profile data received:', profileData);
        
        setFirstName(profileData.firstName || '');
        setLastName(profileData.lastName || '');
        setEmail(profileData.email || '');
        setDateOfBirth(profileData.dateOfBirth ? profileData.dateOfBirth.split('T')[0] : '');
        setBio(profileData.bio || '');
        setAvatar(profileData.avatar || '');
        setSocialLinks({
          facebook: profileData.socials?.facebook || '',
          twitter: profileData.socials?.twitter || '',
          linkedIn: profileData.socials?.linkedIn || ''
        });
        setVerificationDocuments({
          idCard: {
            url: profileData.verificationDocuments?.idCard?.url || '',
            verified: profileData.verificationDocuments?.idCard?.verified || false
          },
          drivingLicense: {
            url: profileData.verificationDocuments?.drivingLicense?.url || '',
            verified: profileData.verificationDocuments?.drivingLicense?.verified || false
          }
        });
      } catch (error) {
        console.error('❌ Fetch error:', error);
      } finally {
        setInitialLoading(false);
      }
    };
    
    fetchProfileData();
  }, []);

  const handleSocialLinkChange = (platform: keyof SocialLinks, value: string) => {
    setSocialLinks(prev => ({ ...prev, [platform]: value }));
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        setLoading(true);
        const url = await uploadFile(file);
        setAvatar(url);
      } catch (error: any) {
        console.error('Avatar upload error:', error);
        alert(error.message || 'Failed to upload avatar');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleDocumentUpload = async (type: 'idCard' | 'drivingLicense', e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        setLoading(true);
        const url = await uploadFile(file);
        setVerificationDocuments(prev => ({
          ...prev,
          [type]: {
            url: url,
            verified: false
          }
        }));
      } catch (error: any) {
        console.error('Document upload error:', error);
        alert(error.message || 'Failed to upload document');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleSaveChanges = async () => {
    setLoading(true);
    try {
      console.log('💾 Saving profile...');
      await updateProfile({
        firstName,
        lastName,
        email,
        dateOfBirth,
        bio,
        avatar,
        socials: socialLinks,
        verificationDocuments
      });
      
      console.log('✅ Profile updated successfully');
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('❌ Save error:', error);
      alert('Error updating profile');
    } finally {
      setLoading(false);
    }
  };

  const charCount = bio.length;
  const maxBioLength = 500;

  if (initialLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-4xl mx-auto px-6 py-8">
        <Card>
          <CardContent className="p-8">
            {/* Profile Header */}
            <div className="flex items-start gap-6 mb-8">
              <div className="relative">
                <div className="w-28 h-28 rounded-full overflow-hidden bg-gray-200">
                  {avatar ? (
                    <img src={avatar} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      <span className="text-3xl">👤</span>
                    </div>
                  )}
                </div>
                <label className="absolute bottom-0 right-0 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center cursor-pointer hover:bg-blue-600 transition-colors">
                  <input type="file" accept="image/*" onChange={handleAvatarUpload} className="hidden" />
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                  </svg>
                </label>
              </div>
              <div className="flex-1">
                <h1 className="text-2xl font-bold text-gray-900 mb-1">
                  {firstName && lastName ? `${firstName} ${lastName}` : 'Your Name'}
                </h1>
                <p className="text-gray-500 text-sm mb-2">Joined in 2022</p>
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                  <span className="text-gray-900 font-medium">{rating.average}</span>
                  <span className="text-gray-500 text-sm">({rating.count} reviews)</span>
                </div>
              </div>
            </div>

            <Separator className="mb-8" />

            {/* Personal Information */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
                <CardDescription>Update your personal details and bio</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name *</Label>
                    <Input
                      id="firstName"
                      type="text"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      placeholder="Sophia"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name *</Label>
                    <Input
                      id="lastName"
                      type="text"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      placeholder="Papadopoulos"
                      required
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="sophia.p@email.com"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="dateOfBirth">Date of Birth *</Label>
                    <Input
                      id="dateOfBirth"
                      type="date"
                      value={dateOfBirth}
                      onChange={(e) => setDateOfBirth(e.target.value)}
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bio">
                    Bio {charCount > 0 && <span className="text-sm text-muted-foreground">({charCount}/{maxBioLength})</span>}
                  </Label>
                  <textarea
                    id="bio"
                    value={bio}
                    onChange={(e) => {
                      if (e.target.value.length <= maxBioLength) {
                        setBio(e.target.value);
                      }
                    }}
                    placeholder="I am a friendly and reliable driver who enjoys meeting new people. I often travel between Athens and Thessaloniki for work. Looking forward to sharing a ride!"
                    rows={4}
                    maxLength={maxBioLength}
                    className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm resize-none"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Social Media */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Social Media</CardTitle>
                <CardDescription>Connect your social media accounts</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="facebook">Facebook</Label>
                    <div className="relative">
                      <div className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center z-10">
                        <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                        </svg>
                      </div>
                      <Input
                        id="facebook"
                        type="text"
                        value={socialLinks.facebook}
                        onChange={(e) => handleSocialLinkChange('facebook', e.target.value)}
                        placeholder="sophia.papadopoulos"
                        className="pl-14"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="twitter">X (Twitter)</Label>
                    <div className="relative">
                      <div className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 bg-black rounded-full flex items-center justify-center z-10">
                        <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                        </svg>
                      </div>
                      <Input
                        id="twitter"
                        type="text"
                        value={socialLinks.twitter}
                        onChange={(e) => handleSocialLinkChange('twitter', e.target.value)}
                        placeholder="@yourhandle"
                        className="pl-14"
                      />
                    </div>
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="linkedin">LinkedIn</Label>
                    <div className="relative md:w-1/2">
                      <div className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 bg-blue-700 rounded-full flex items-center justify-center z-10">
                        <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                        </svg>
                      </div>
                      <Input
                        id="linkedin"
                        type="text"
                        value={socialLinks.linkedIn}
                        onChange={(e) => handleSocialLinkChange('linkedIn', e.target.value)}
                        placeholder="sophia-papadopoulos"
                        className="pl-14"
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Verification Documents */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Verification Documents</CardTitle>
                <CardDescription>Upload your identification documents</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="idCard">ID Card</Label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-gray-400 transition-colors">
                      {verificationDocuments.idCard.url ? (
                        <div className="space-y-2">
                          <div className="text-sm text-green-600 flex items-center justify-center gap-1">
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            Uploaded {verificationDocuments.idCard.verified && '(Verified)'}
                          </div>
                          <label className="cursor-pointer text-sm text-blue-600 hover:text-blue-700">
                            Change document
                            <input
                              type="file"
                              accept="image/*,.pdf"
                              onChange={(e) => handleDocumentUpload('idCard', e)}
                              className="hidden"
                            />
                          </label>
                        </div>
                      ) : (
                        <label className="cursor-pointer">
                          <Upload className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                          <span className="text-sm text-gray-600">Click to upload ID Card</span>
                          <input
                            type="file"
                            accept="image/*,.pdf"
                            onChange={(e) => handleDocumentUpload('idCard', e)}
                            className="hidden"
                          />
                        </label>
                      )}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="drivingLicense">Driving License</Label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-gray-400 transition-colors">
                      {verificationDocuments.drivingLicense.url ? (
                        <div className="space-y-2">
                          <div className="text-sm text-green-600 flex items-center justify-center gap-1">
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            Uploaded {verificationDocuments.drivingLicense.verified && '(Verified)'}
                          </div>
                          <label className="cursor-pointer text-sm text-blue-600 hover:text-blue-700">
                            Change document
                            <input
                              type="file"
                              accept="image/*,.pdf"
                              onChange={(e) => handleDocumentUpload('drivingLicense', e)}
                              className="hidden"
                            />
                          </label>
                        </div>
                      ) : (
                        <label className="cursor-pointer">
                          <Upload className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                          <span className="text-sm text-gray-600">Click to upload Driving License</span>
                          <input
                            type="file"
                            accept="image/*,.pdf"
                            onChange={(e) => handleDocumentUpload('drivingLicense', e)}
                            className="hidden"
                          />
                        </label>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Save Button */}
            <div className="flex justify-end">
              <Button
                size="lg"
                onClick={handleSaveChanges}
                disabled={loading}
              >
                {loading ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default JourneyLinkProfile;