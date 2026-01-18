"use client"

import { useState, useRef } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Upload, X, Loader2, Camera } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface AvatarUploadProps {
    currentAvatar?: string
    userName: string
    onUploadSuccess: (avatarUrl: string) => void
}

/**
 * Optimize image before upload:
 * - Resize to max 400x400 maintaining aspect ratio
 * - Convert to WebP with 85% quality
 * - Significantly reduces file size
 */
const optimizeImage = (file: File): Promise<Blob> => {
    return new Promise((resolve, reject) => {
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')
        if (!ctx) {
            reject(new Error('Failed to get canvas context'))
            return
        }

        const img = new Image()

        img.onload = () => {
            // Resize to max 400x400 maintaining aspect ratio
            const maxSize = 400
            let { width, height } = img

            if (width > height) {
                if (width > maxSize) {
                    height = (height / width) * maxSize
                    width = maxSize
                }
            } else {
                if (height > maxSize) {
                    width = (width / height) * maxSize
                    height = maxSize
                }
            }

            canvas.width = width
            canvas.height = height

            // Enable image smoothing for better quality
            ctx.imageSmoothingEnabled = true
            ctx.imageSmoothingQuality = 'high'
            ctx.drawImage(img, 0, 0, width, height)

            // Convert to WebP with 85% quality (good balance of quality/size)
            canvas.toBlob(
                (blob) => {
                    if (blob) {
                        resolve(blob)
                    } else {
                        reject(new Error('Failed to convert image'))
                    }
                },
                'image/webp',
                0.85
            )

            // Cleanup
            URL.revokeObjectURL(img.src)
        }

        img.onerror = () => {
            reject(new Error('Failed to load image'))
            URL.revokeObjectURL(img.src)
        }

        img.src = URL.createObjectURL(file)
    })
}

export function AvatarUpload({ currentAvatar, userName, onUploadSuccess }: AvatarUploadProps) {
    const [uploading, setUploading] = useState(false)
    const [preview, setPreview] = useState<string | null>(null)
    const fileInputRef = useRef<HTMLInputElement>(null)
    const { toast } = useToast()

    const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]
        if (!file) return

        // Validate file type
        if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
            toast({
                title: "Invalid file type",
                description: "Please upload a JPEG, PNG, or WebP image",
                variant: "destructive",
            })
            return
        }

        // Validate file size (5MB)
        if (file.size > 5 * 1024 * 1024) {
            toast({
                title: "File too large",
                description: "Please upload an image smaller than 5MB",
                variant: "destructive",
            })
            return
        }

        // Show preview
        const reader = new FileReader()
        reader.onloadend = () => {
            setPreview(reader.result as string)
        }
        reader.readAsDataURL(file)

        // Upload file
        await uploadFile(file)
    }

    const uploadFile = async (file: File) => {
        setUploading(true)

        try {
            // Optimize image before upload (resize + compress)
            const optimizedBlob = await optimizeImage(file)
            const optimizedFile = new File([optimizedBlob], 'avatar.webp', { type: 'image/webp' })

            const formData = new FormData()
            formData.append('avatar', optimizedFile)

            const accessToken = localStorage.getItem('access_token')
            const response = await fetch('/api/v1/profile/avatar', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                },
                credentials: 'include',
                body: formData,
            })

            if (!response.ok) {
                const error = await response.json()
                throw new Error(error.error?.message || error.message || 'Upload failed')
            }

            const responseData = await response.json()
            // Backend wraps response in { success: true, data: { avatarUrl: ... } }
            const avatarUrl = responseData.data?.avatarUrl || responseData.avatarUrl
            onUploadSuccess(avatarUrl)
            setPreview(null)

            toast({
                title: "Avatar updated",
                description: "Your profile photo has been optimized and updated",
            })
        } catch (error) {
            console.error('Upload error:', error)
            toast({
                title: "Upload failed",
                description: error instanceof Error ? error.message : "Failed to upload avatar",
                variant: "destructive",
            })
            setPreview(null)
        } finally {
            setUploading(false)
            if (fileInputRef.current) {
                fileInputRef.current.value = ''
            }
        }
    }

    const handleDelete = async () => {
        try {
            const accessToken = localStorage.getItem('access_token')
            const response = await fetch('/api/v1/profile/avatar', {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                },
                credentials: 'include',
            })

            if (!response.ok) {
                throw new Error('Delete failed')
            }

            onUploadSuccess('')
            toast({
                title: "Avatar removed",
                description: "Your profile photo has been removed",
            })
        } catch (error) {
            toast({
                title: "Delete failed",
                description: "Failed to remove avatar",
                variant: "destructive",
            })
        }
    }

    const displayAvatar = preview || currentAvatar

    return (
        <Card className="bg-card/50 border-border/50">
            <CardContent className="pt-6">
                <div className="flex flex-col items-center gap-4">
                    <div className="relative">
                        <Avatar className="h-32 w-32 border-4 border-background shadow-lg">
                            <AvatarImage src={displayAvatar} alt={userName} />
                            <AvatarFallback className="text-4xl">
                                {userName.split(' ').map(n => n[0]).join('').toUpperCase()}
                            </AvatarFallback>
                        </Avatar>

                        {uploading && (
                            <div className="absolute inset-0 flex items-center justify-center bg-background/80 rounded-full">
                                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                            </div>
                        )}

                        <button
                            onClick={() => fileInputRef.current?.click()}
                            disabled={uploading}
                            className="absolute bottom-0 right-0 p-2 bg-primary text-primary-foreground rounded-full shadow-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
                        >
                            <Camera className="h-4 w-4" />
                        </button>
                    </div>

                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        onChange={handleFileSelect}
                        className="hidden"
                    />

                    <div className="flex gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => fileInputRef.current?.click()}
                            disabled={uploading}
                        >
                            <Upload className="h-4 w-4 mr-2" />
                            Upload Photo
                        </Button>

                        {currentAvatar && (
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={handleDelete}
                                disabled={uploading}
                            >
                                <X className="h-4 w-4 mr-2" />
                                Remove
                            </Button>
                        )}
                    </div>

                    <p className="text-xs text-muted-foreground text-center">
                        JPG, PNG or WebP. Max 5MB.
                    </p>
                </div>
            </CardContent>
        </Card>
    )
}
