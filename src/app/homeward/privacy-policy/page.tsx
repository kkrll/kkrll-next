import PageLayout from "@/components/PageLayout";

const PrivacyPolicyPage = () => {
  return (
    <PageLayout>
      <section className="prose-sm text-foreground prose-headings:text-foreground px-default w-full text-left">
        <h1>Privacy Policy for Homeward</h1>

        <p className="mb-10">
          <em>Last updated: September, 2025</em>
        </p>

        <h2>What This Extension Does</h2>

        <p>
          Homeward replaces your new tab page with organized bookmark
          collections. It stores bookmarks locally first, with optional cloud
          sync via Google sign-in.
        </p>

        <h2>Data We Collect</h2>

        <p>
          <strong>Bookmark Data:</strong>
        </p>
        <ul>
          <li>URLs, titles, and favicons of your bookmarks</li>
          <li>Group and collection names and organization</li>
          <li>Sync timestamps</li>
        </ul>

        <p>
          <strong>Optional Cloud Data (only if you sign in):</strong>
        </p>
        <ul>
          <li>Google account ID for authentication</li>
          <li>Secure authentication tokens (auto-refreshed)</li>
        </ul>

        <p>
          <strong>Preferences:</strong>
        </p>
        <ul>
          <li>Theme and layout settings</li>
        </ul>

        <h2>How We Use Your Data</h2>

        <ul>
          <li>Store bookmarks locally in your browser</li>
          <li>
            Sync across devices (if signed in) using smart conflict resolution
          </li>
          <li>Remember your preferences</li>
          <li>Authenticate cloud access via Google OAuth</li>
        </ul>

        <h2>Data Storage</h2>

        <p>
          <strong>Local:</strong> Primary storage in your browser's localStorage
          - works offline, loads instantly.
        </p>

        <p>
          <strong>Cloud (Optional):</strong> Supabase secure database for
          cross-device sync and backup.
        </p>

        <h2>Your Privacy Rights</h2>

        <p>
          <strong>You control your data:</strong>
        </p>
        <ul>
          <li>Use completely offline without signing in</li>
          <li>Export your bookmarks as JSON anytime</li>
          <li>Delete collections through the extension</li>
          <li>Revoke Google access at myaccount.google.com</li>
          <li>Uninstall to remove all local data</li>
        </ul>

        <p>
          <strong>We protect your privacy:</strong>
        </p>
        <ul>
          <li>No data selling or advertising</li>
          <li>No browsing tracking outside new tab page</li>
          <li>No access to existing Chrome bookmarks</li>
          <li>Minimal permissions (new tab + storage only)</li>
          <li>HTTPS encryption for all data transmission</li>
        </ul>

        <h2>Data Retention</h2>

        <ul>
          <li>
            <strong>Local:</strong> Until you uninstall or clear browser data
          </li>
          <li>
            <strong>Cloud:</strong> Until you delete collections (account
            deletion feature coming soon)
          </li>
          <li>
            <strong>Tokens:</strong> Auto-expire and refresh for security
          </li>
        </ul>

        <h2>Contact &amp; Compliance</h2>

        <p>Questions? Contact via Chrome Web Store or GitHub issues.</p>

        <p>
          Complies with Chrome Web Store policies and Google's User Data Policy.
        </p>

        <p>
          <em>Homeward by kkrll</em>
        </p>
      </section>
    </PageLayout>
  );
};

export default PrivacyPolicyPage;
