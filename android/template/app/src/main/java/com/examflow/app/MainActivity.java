package com.examflow.app;

import android.annotation.SuppressLint;
import android.graphics.Bitmap;
import android.os.Bundle;
import android.view.View;
import android.webkit.WebChromeClient;
import android.webkit.WebResourceError;
import android.webkit.WebResourceRequest;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.ProgressBar;
import android.widget.TextView;

import androidx.appcompat.app.AppCompatActivity;

public class MainActivity extends AppCompatActivity {

    private WebView webView;
    private ProgressBar progressBar;
    private View offlineView;
    private TextView offlineMessage;

    @SuppressLint("SetJavaScriptEnabled")
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        webView = findViewById(R.id.webview);
        progressBar = findViewById(R.id.progress);
        offlineView = findViewById(R.id.offline_container);
        offlineMessage = findViewById(R.id.offline_message);

        WebSettings settings = webView.getSettings();
        settings.setJavaScriptEnabled(true);
        settings.setDomStorageEnabled(true);
        settings.setDatabaseEnabled(true);
        settings.setLoadWithOverviewMode(true);
        settings.setUseWideViewPort(true);
        settings.setSupportZoom(false);
        settings.setBuiltInZoomControls(false);
        settings.setDisplayZoomControls(false);
        settings.setMediaPlaybackRequiresUserGesture(false);
        settings.setMixedContentMode(WebSettings.MIXED_CONTENT_NEVER_ALLOW);
        settings.setCacheMode(WebSettings.LOAD_DEFAULT);

        webView.setWebChromeClient(new WebChromeClient() {
            @Override
            public void onProgressChanged(WebView view, int newProgress) {
                if (newProgress < 100) {
                    progressBar.setVisibility(View.VISIBLE);
                    progressBar.setProgress(newProgress);
                } else {
                    progressBar.setVisibility(View.GONE);
                }
            }
        });

        webView.setWebViewClient(new WebViewClient() {
            @Override
            public boolean shouldOverrideUrlLoading(WebView view, WebResourceRequest request) {
                String host = request.getUrl().getHost();
                if (host == null) return true;
                if (host.equals("examflow-backend-79ws.onrender.com")
                        || host.endsWith(".onrender.com")
                        || host.endsWith(".firebaseapp.com")
                        || host.endsWith(".googleapis.com")
                        || host.endsWith(".gstatic.com")
                        || host.equals("accounts.google.com")
                        || host.equals("identitytoolkit.googleapis.com")
                        || host.equals("securetoken.googleapis.com")
                        || host.endsWith(".cloudfunctions.net")) {
                    return false;
                }
                try {
                    startActivity(new android.content.Intent(
                            android.content.Intent.ACTION_VIEW, request.getUrl()));
                } catch (Exception ignored) {}
                return true;
            }

            @Override
            public void onPageStarted(WebView view, String url, Bitmap favicon) {
                offlineView.setVisibility(View.GONE);
                webView.setVisibility(View.VISIBLE);
            }

            @Override
            public void onReceivedError(WebView view, WebResourceRequest request, WebResourceError error) {
                if (request.isForMainFrame()) {
                    showOffline();
                }
            }
        });

        findViewById(R.id.retry_button).setOnClickListener(v -> {
            offlineView.setVisibility(View.GONE);
            webView.setVisibility(View.VISIBLE);
            webView.loadUrl(getString(R.string.start_url));
        });

        webView.loadUrl(getString(R.string.start_url));
    }

    private void showOffline() {
        webView.setVisibility(View.GONE);
        offlineView.setVisibility(View.VISIBLE);
        offlineMessage.setText(getString(R.string.offline_message));
    }

    @Override
    public void onBackPressed() {
        if (webView.canGoBack()) {
            webView.goBack();
        } else {
            super.onBackPressed();
        }
    }
}
