# Barakah Travel

This repository uses Laravel + Inertia and manages packages with optional Cloudinary media uploads.

## Cloudinary Setup (Optional)

If you'd like to use Cloudinary for storing media (images/videos) rather than the local disk, follow these steps:

1. Install the official PHP SDK:

```bash
composer require cloudinary/cloudinary_php
```

2. Add your Cloudinary environment variables in `.env` (or `.env.example` for reference):

```dotenv
# Cloudinary configuration
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

3. `config/services.php` will automatically read these variables from the `cloudinary` key we added. No further code changes required because the code uses the Cloudinary SDK only when it is installed (if the SDK is not present, the app falls back to local storage).

4. To enable Cloudinary in production or local servers, make sure to run the migrations (the `media` table must be extended with an `external_id`):

```bash
php artisan migrate
```

5. Restart any workers / queue listeners after changing env vars, and make sure queue workers can access the environment variables.

```bash
# Example: start queue worker for local dev
php artisan queue:work --tries=3
```

6. Verify the upload flow by creating a package and attaching media. If the Cloudinary SDK is installed and env vars are set, the app will upload content to Cloudinary (and use disk `cloudinary` in the database); otherwise it will use the `public` disk.

### Notes

- The backend uses `class_exists(\Cloudinary\Cloudinary::class)` to check if Cloudinary is installed before attempting cloud uploads.
- If the Cloudinary upload fails during a job, the local tmp file is cleaned up and the exception is re-thrown for debugging.
- For more advanced integrations, you may prefer client-side direct uploads using Cloudinary's upload signatures to offload server processing. I can help implement that if you prefer.
