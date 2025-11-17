import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Upload, X } from 'lucide-react';
import { useRef, useState } from 'react';
import { z } from 'zod';

interface MediaFile {
    id: string;
    file: File;
    type: 'image' | 'video';
    preview?: string;
    altText?: string;
}

interface MediaUploadProps {
    onFilesSelected: (files: MediaFile[]) => void;
    maxFiles?: number;
    acceptedMimes?: string;
    maxFileSize?: number; // in bytes
    error?: string;
}

const mediaSchema = z.object({
    type: z.enum(['image', 'video']),
    altText: z.string().max(255).optional(),
});

type MediaFormValues = z.infer<typeof mediaSchema>;

export default function MediaUpload({
    onFilesSelected,
    maxFiles = 5,
    acceptedMimes = 'image/*,video/*',
    maxFileSize = 5242880, // 5MB
    error,
}: MediaUploadProps) {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [files, setFiles] = useState<MediaFile[]>([]);
    const [uploading, setUploading] = useState(false);
    const [formErrors, setFormErrors] = useState<
        Record<string, Record<string, string>>
    >({});

    const [mediaForms, setMediaForms] = useState<
        Record<string, MediaFormValues>
    >({});

    const getMediaType = (mimeType: string): 'image' | 'video' => {
        return mimeType.startsWith('video') ? 'video' : 'image';
    };

    const handleFileInputChange = (
        event: React.ChangeEvent<HTMLInputElement>,
    ) => {
        const selectedFiles = Array.from(event.target.files || []);

        if (selectedFiles.length === 0) return;

        const newFiles: MediaFile[] = [];
        const newErrors: Record<string, Record<string, string>> = {};

        for (const file of selectedFiles) {
            // Check file size
            if (file.size > maxFileSize) {
                const id = `${file.name}-${Date.now()}`;
                newErrors[id] = {
                    size: `File size must not exceed ${Math.round(maxFileSize / 1024 / 1024)}MB`,
                };
                continue;
            }

            // Check file type
            const mediaType = getMediaType(file.type);
            const isImage = file.type.startsWith('image/');
            const isVideo = file.type.startsWith('video/');

            if (!isImage && !isVideo) {
                const id = `${file.name}-${Date.now()}`;
                newErrors[id] = {
                    type: 'File must be an image or video',
                };
                continue;
            }

            const id = `${file.name}-${Date.now()}`;

            // Create preview for images
            let preview: string | undefined;
            if (isImage) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    setFiles((prev) =>
                        prev.map((f) =>
                            f.id === id
                                ? {
                                      ...f,
                                      preview: e.target?.result as string,
                                  }
                                : f,
                        ),
                    );
                };
                reader.readAsDataURL(file);
            }

            newFiles.push({
                id,
                file,
                type: mediaType,
                preview,
                altText: '',
            });

            setMediaForms((prev) => ({
                ...prev,
                [id]: {
                    type: mediaType,
                    altText: '',
                },
            }));
        }

        if (Object.keys(newErrors).length > 0) {
            setFormErrors((prev) => ({ ...prev, ...newErrors }));
        }

        const combinedFiles = [...files, ...newFiles];
        if (combinedFiles.length > maxFiles) {
            setFiles(combinedFiles.slice(0, maxFiles));
        } else {
            setFiles(combinedFiles);
        }

        // Reset input
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const removeFile = (id: string) => {
        setFiles((prev) => prev.filter((f) => f.id !== id));
        setFormErrors((prev) => {
            const newErrors = { ...prev };
            delete newErrors[id];
            return newErrors;
        });
        setMediaForms((prev) => {
            const newForms = { ...prev };
            delete newForms[id];
            return newForms;
        });
    };

    const updateMediaForm = (
        id: string,
        key: keyof MediaFormValues,
        value: string,
    ) => {
        setMediaForms((prev) => ({
            ...prev,
            [id]: {
                ...prev[id],
                [key]: value,
            },
        }));
    };

    const handleUpload = () => {
        setUploading(true);
        // Validate all forms
        const validatedFiles: MediaFile[] = [];

        for (const file of files) {
            const form = mediaForms[file.id];
            const parsed = mediaSchema.safeParse(form);

            if (!parsed.success) {
                const fieldErrors: Record<string, string> = {};
                parsed.error.issues.forEach((issue) => {
                    const key = issue.path[0] as string;
                    fieldErrors[key] = issue.message;
                });
                setFormErrors((prev) => ({
                    ...prev,
                    [file.id]: fieldErrors,
                }));
            } else {
                validatedFiles.push({
                    ...file,
                    type: parsed.data.type,
                    altText: parsed.data.altText,
                });
            }
        }

        if (validatedFiles.length === files.length) {
            onFilesSelected(validatedFiles);
            setFiles([]);
            setFormErrors({});
            setMediaForms({});
        }

        setUploading(false);
    };

    const hasErrors = Object.keys(formErrors).length > 0;

    return (
        <div className="space-y-4">
            <div>
                <Label htmlFor="media-upload">Upload Media</Label>
                <p className="text-sm text-muted-foreground">
                    Upload images and videos (max {maxFiles} files, up to{' '}
                    {Math.round(maxFileSize / 1024 / 1024)}MB each)
                </p>

                <div className="mt-2">
                    <input
                        ref={fileInputRef}
                        type="file"
                        id="media-upload"
                        multiple
                        accept={acceptedMimes}
                        onChange={handleFileInputChange}
                        className="hidden"
                        disabled={uploading || files.length >= maxFiles}
                    />
                    <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={uploading || files.length >= maxFiles}
                        className="inline-flex items-center gap-2 rounded-md border border-input bg-background px-3 py-2 text-sm transition-colors hover:bg-accent hover:text-accent-foreground disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        <Upload className="h-4 w-4" />
                        Choose Files
                    </button>
                </div>

                {error && <InputError message={error} />}
            </div>

            {files.length > 0 && (
                <div className="max-h-64 space-y-3 overflow-y-auto rounded-lg border border-input bg-accent/30 p-4">
                    <div className="flex items-center justify-between">
                        <h3 className="text-sm font-semibold">
                            Selected Files ({files.length}/{maxFiles})
                        </h3>
                        {files.length > 0 && (
                            <Button
                                type="button"
                                size="sm"
                                onClick={handleUpload}
                                disabled={uploading || hasErrors}
                                className="shrink-0"
                            >
                                {uploading ? 'Uploading...' : 'Add All'}
                            </Button>
                        )}
                    </div>

                    <div className="space-y-3">
                        {files.map((file) => {
                            const form = mediaForms[file.id];
                            const fileErrors = formErrors[file.id];

                            return (
                                <div
                                    key={file.id}
                                    className="shrink-0 space-y-2 rounded-md border border-input p-3"
                                >
                                    <div className="flex items-start gap-3">
                                        {file.preview && (
                                            <img
                                                src={file.preview}
                                                alt={file.file.name}
                                                className="h-16 w-16 shrink-0 rounded object-cover"
                                            />
                                        )}
                                        <div className="min-w-0 flex-1 space-y-1">
                                            <p className="truncate text-sm font-medium">
                                                {file.file.name}
                                            </p>
                                            <p className="text-xs text-muted-foreground">
                                                {Math.round(
                                                    file.file.size / 1024,
                                                )}{' '}
                                                KB
                                            </p>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => removeFile(file.id)}
                                            className="shrink-0 text-muted-foreground transition-colors hover:text-destructive"
                                        >
                                            <X className="h-4 w-4" />
                                        </button>
                                    </div>

                                    <div className="grid gap-2 sm:grid-cols-2">
                                        <div>
                                            <Label
                                                htmlFor={`type-${file.id}`}
                                                className="text-xs"
                                            >
                                                Type
                                            </Label>
                                            <Select
                                                value={form?.type || 'image'}
                                                onValueChange={(value) =>
                                                    updateMediaForm(
                                                        file.id,
                                                        'type',
                                                        value,
                                                    )
                                                }
                                            >
                                                <SelectTrigger
                                                    id={`type-${file.id}`}
                                                    className="h-8"
                                                >
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="image">
                                                        Image
                                                    </SelectItem>
                                                    <SelectItem value="video">
                                                        Video
                                                    </SelectItem>
                                                </SelectContent>
                                            </Select>
                                            {fileErrors?.type && (
                                                <InputError
                                                    message={fileErrors.type}
                                                />
                                            )}
                                        </div>
                                        <div>
                                            <Label
                                                htmlFor={`alt-${file.id}`}
                                                className="text-xs"
                                            >
                                                Alt Text (optional)
                                            </Label>
                                            <Input
                                                id={`alt-${file.id}`}
                                                size={1}
                                                placeholder="Describe image"
                                                value={form?.altText || ''}
                                                onChange={(e) =>
                                                    updateMediaForm(
                                                        file.id,
                                                        'altText',
                                                        e.target.value,
                                                    )
                                                }
                                                className="h-8"
                                            />
                                            {fileErrors?.altText && (
                                                <InputError
                                                    message={fileErrors.altText}
                                                />
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
}
