# ExamFlow Downloads

Windows desktop applications for the ExamFlow examination platform.

These are thin, secure Electron wrappers that open the existing hosted ExamFlow portals. They do **not** replace or duplicate the backend. Authentication, permissions, and all business logic remain on the server.

## Applications

| Role | Windows App | Web Portal |
|------|-------------|------------|
| School Admin | ExamFlow School Admin | https://examflow-backend-79ws.onrender.com/admin |
| District Admin | ExamFlow District Admin | https://examflow-backend-79ws.onrender.com/district/ |
| Teacher | ExamFlow Teacher | https://examflow-backend-79ws.onrender.com/teacher/ |
| Student | ExamFlow Student | https://examflow-backend-79ws.onrender.com/student/ |

## Requirements

- Windows 10 or Windows 11 (64-bit)
- Active internet connection (the portals are hosted online)
- No local server or database is required

## Download

Download the latest installers and portable executables from the [Releases](https://github.com/joelinthechat-max/examflow-downloads/releases) page.

Recommended:

- **Setup** (`.exe` installer) — installs the app, creates Start Menu and desktop shortcuts.
- **Portable** — single `.exe` that runs without installation (useful for shared or locked-down PCs).

### Security notice (unsigned builds)

These applications are currently **not code-signed**. Windows SmartScreen or antivirus software may show a warning the first time you run them. This is expected for unsigned software. You can choose “More info” → “Run anyway” if you trust the source (this repository).

We recommend obtaining a code-signing certificate for production distribution.

## Building from source

### Prerequisites

- Node.js 20+ (LTS recommended)
- Windows machine (or GitHub Actions `windows-latest` runner) for producing Windows executables

### Per-app build

```bash
cd apps/school-admin   # or district-admin / teacher / student
npm install
npm run build
```

Artifacts appear in `apps/<role>/dist/`:

- `ExamFlow-*-Setup-1.0.0.exe` (NSIS installer)
- `ExamFlow-*-Portable-1.0.0.exe` (portable)

### Automated builds

Push a version tag (e.g. `v1.0.0`) or create a GitHub Release. The workflow in `.github/workflows/build-release.yml` builds all four apps on Windows and uploads the executables as release assets.

## Architecture notes

- `nodeIntegration: false`
- `contextIsolation: true`
- `sandbox: true`
- Strict URL allow-list (ExamFlow host + required Firebase / Google auth domains)
- External links open in the system browser
- Offline page shown on network failure
- No credentials or tokens are injected; login happens entirely in the web portal

## Versioning

Follow semantic versioning. Update the `version` field in each app’s `package.json` before tagging a new release.

## License

Proprietary — ExamFlow. All rights reserved.
