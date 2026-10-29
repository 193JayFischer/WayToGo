# Way To Go Hub (Android)

A small Android app that opens https://waytogonj.com/admin.html in a WebView, so the
admin hub works on a phone that has no web browser installed. Only waytogonj.com opens
inside the app; phone, text and WhatsApp links hand off to those apps; any other website
is refused.

Install: copy `waytogo-hub.apk` to the phone and open it (allow installs from that source
once). Source is in `src/`. Built with the Ubuntu packages aapt, dalvik-exchange, zipalign
and apksigner against android-23. The signing keystore is not in this repo; to update the
installed app you would need the same keystore, otherwise uninstall and reinstall.
