package com.waytogonj.hub;

import android.app.Activity;
import android.content.ActivityNotFoundException;
import android.content.Intent;
import android.graphics.Bitmap;
import android.net.Uri;
import android.os.Bundle;
import android.view.View;
import android.webkit.CookieManager;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.Toast;

public class MainActivity extends Activity {
    private static final String HOME = "https://waytogonj.com/admin.html";
    private static final String HOST = "waytogonj.com";
    private WebView web;

    @Override
    protected void onCreate(Bundle saved) {
        super.onCreate(saved);
        web = new WebView(this);
        web.setLayoutParams(new android.view.ViewGroup.LayoutParams(
            android.view.ViewGroup.LayoutParams.MATCH_PARENT,
            android.view.ViewGroup.LayoutParams.MATCH_PARENT));
        setContentView(web);

        WebSettings s = web.getSettings();
        s.setJavaScriptEnabled(true);
        s.setDomStorageEnabled(true);
        s.setDatabaseEnabled(true);
        s.setCacheMode(WebSettings.LOAD_DEFAULT);
        s.setUseWideViewPort(true);
        s.setLoadWithOverviewMode(true);
        s.setSupportZoom(false);
        s.setMixedContentMode(WebSettings.MIXED_CONTENT_NEVER_ALLOW);
        s.setUserAgentString(s.getUserAgentString() + " WayToGoHub/1.0");
        CookieManager.getInstance().setAcceptCookie(true);
        CookieManager.getInstance().setAcceptThirdPartyCookies(web, true);

        web.setWebViewClient(new WebViewClient() {
            @Override
            public boolean shouldOverrideUrlLoading(WebView v, String url) {
                return handle(Uri.parse(url));
            }
        });

        if (saved != null) web.restoreState(saved); else web.loadUrl(HOME);
    }

    // Only waytogonj.com opens inside the app. Phone, text and WhatsApp links go to
    // the matching app. Any other website is refused, so the app is not a browser.
    private boolean handle(Uri u) {
        String scheme = u.getScheme() == null ? "" : u.getScheme();
        String host = u.getHost() == null ? "" : u.getHost().toLowerCase();
        if (scheme.equals("https") && (host.equals(HOST) || host.endsWith("." + HOST))) return false;
        if (scheme.equals("https") && (host.endsWith("firebaseapp.com") || host.endsWith("web.app"))) return false;
        if (scheme.equals("tel") || scheme.equals("sms") || scheme.equals("smsto") || scheme.equals("mailto")
            || scheme.equals("whatsapp") || host.equals("wa.me") || host.equals("api.whatsapp.com")) {
            try { startActivity(new Intent(Intent.ACTION_VIEW, u)); }
            catch (ActivityNotFoundException e) { Toast.makeText(this, "No app on this phone can open that.", Toast.LENGTH_SHORT).show(); }
            return true;
        }
        Toast.makeText(this, "Only waytogonj.com opens in this app.", Toast.LENGTH_SHORT).show();
        return true;
    }

    @Override
    public void onBackPressed() {
        if (web.canGoBack()) web.goBack(); else super.onBackPressed();
    }

    @Override
    protected void onSaveInstanceState(Bundle out) {
        super.onSaveInstanceState(out);
        web.saveState(out);
    }

    @Override
    protected void onResume() { super.onResume(); web.onResume(); }
    @Override
    protected void onPause() { web.onPause(); super.onPause(); }
}
