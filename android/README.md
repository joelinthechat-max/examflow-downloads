# ExamFlow Android (Web-to-APK)

Thin Android WebView wrappers that open the existing ExamFlow web portals.

These are **not** native rewrites. They load:

| Role | URL |
|------|-----|
| School Admin | https://examflow-backend-79ws.onrender.com/admin |
| District Admin | https://examflow-backend-79ws.onrender.com/district/ |
| Teacher | https://examflow-backend-79ws.onrender.com/teacher/ |
| Student | https://examflow-backend-79ws.onrender.com/student/ |

## Requirements

- Android 8.0+ (API 26+)
- Internet connection
- Sideloading enabled (or install via your MDM)

## Security notes

- Apps are currently **debug-signed** for direct download.
- Google Play requires a proper release keystore and review; these APKs are intended for direct distribution / school devices.
- Authentication remains on the server. No credentials are stored in the APK.

## Build

APKs are produced by the GitHub Actions workflow `build-android.yml`.
After a successful run they appear on the Releases page alongside the Windows installers.
