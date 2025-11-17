import InputError from '@/components/input-error';
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
import { useEffect, useRef, useState } from 'react';

interface MediaFile {
    id: string;
    file?: File; // undefined for existing remote files
    type: 'image' | 'video';
    preview?: string;
    altText?: string;
}

interface MediaUploadProps {
    onFilesSelected: (files: MediaFile[]) => void;
    /** Optional initial files shown in the upload area; these will not be set as File objects */
    initialFiles?: Array<{
        id: number | string;
        path: string;
        type: 'image' | 'video';
        alt_text?: string | null;
        mime_type?: string | null;
    }>;
    maxFiles?: number;
    acceptedMimes?: string;
    maxFileSize?: number; // in bytes
    error?: string;
}

export default function MediaUpload({
    onFilesSelected,
    initialFiles,
    maxFiles = 5,
    acceptedMimes = 'image/*,video/*',
    maxFileSize = 5242880, // 5MB
    error,
}: MediaUploadProps) {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [files, setFiles] = useState<MediaFile[]>([]);
    // Load initial remote files when provided
    useEffect(() => {
        if (!initialFiles || initialFiles.length === 0) return;

        const mapped = initialFiles.slice(0, maxFiles).map(
            (f) =>
                ({
                    id: `remote-${f.id}`,
                    type: f.type,
                    preview: f.path,
                    altText: f.alt_text ?? '',
                }) as MediaFile,
        );

        setFiles((prev) => {
            const combined = [...mapped, ...prev].slice(0, maxFiles);
            // set initial media form defaults for remote files
            const mediaDefaults = mapped.reduce(
                (acc, f) => {
                    acc[f.id] = { type: f.type, altText: f.altText };
                    return acc;
                },
                {} as Record<
                    string,
                    { type: 'image' | 'video'; altText?: string }
                >,
            );

            setMediaForms((prevForms) => ({ ...mediaDefaults, ...prevForms }));
            onFilesSelected(combined);
            return combined;
        });
    }, [initialFiles, maxFiles, onFilesSelected]);
    const [formErrors, setFormErrors] = useState<
        Record<string, Record<string, string>>
    >({});

    const [mediaForms, setMediaForms] = useState<
        Record<string, { type: 'image' | 'video'; altText?: string }>
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

            const newFile: MediaFile = {
                id,
                file,
                type: mediaType,
                preview,
                altText: '',
            };

            newFiles.push(newFile);

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

        // Automatically add files to parent component
        const autoValidatedFiles = newFiles.map((file) => ({
            ...file,
            type: getMediaType(file.file!.type),
            altText: '',
        }));

        onFilesSelected([...files, ...autoValidatedFiles].slice(0, maxFiles));

        // Reset input
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const removeFile = (id: string) => {
        const updatedFiles = files.filter((f) => f.id !== id);
        setFiles(updatedFiles);

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

        // Update parent
        onFilesSelected(updatedFiles);
    };

    const updateMediaForm = (
        id: string,
        key: 'type' | 'altText',
        value: string,
    ) => {
        setMediaForms((prev) => ({
            ...prev,
            [id]: {
                ...prev[id],
                [key]: value,
            },
        }));

        // Update the file in files array
        const updatedFiles = files.map((f) => {
            if (f.id === id) {
                return {
                    ...f,
                    [key === 'altText' ? 'altText' : 'type']: value,
                };
            }
            return f;
        });
        setFiles(updatedFiles);

        // Update parent
        onFilesSelected(updatedFiles);
    };

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
                        disabled={files.length >= maxFiles}
                    />
                    <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={files.length >= maxFiles}
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
                                                alt={
                                                    file.file?.name ??
                                                    file.altText ??
                                                    ''
                                                }
                                                className="h-16 w-16 shrink-0 rounded object-cover"
                                            />
                                        )}
                                        <div className="min-w-0 flex-1 space-y-1">
                                            <p className="truncate text-sm font-medium">
                                                {file.file?.name ??
                                                    file.preview
                                                        ?.split('/')
                                                        .pop() ??
                                                    'Remote media'}
                                            </p>
                                            {file.file && (
                                                <p className="text-xs text-muted-foreground">
                                                    {Math.round(
                                                        file.file.size / 1024,
                                                    )}{' '}
                                                    KB
                                                </p>
                                            )}
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
