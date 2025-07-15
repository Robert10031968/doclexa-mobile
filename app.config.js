export default {
  expo: {
    name: "DocLexa",
    slug: "doclexa",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/images/icon.png",
    scheme: "doclexa",
    userInterfaceStyle: "automatic",
    newArchEnabled: true,
    ios: {
      supportsTablet: true
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/images/adaptive-icon.png",
        backgroundColor: "#ffffff"
      },
      edgeToEdgeEnabled: true
    },
    web: {
      bundler: "metro",
      output: "static",
      favicon: "./assets/images/favicon.png"
    },
    plugins: [
      "expo-document-picker",
      "expo-image-picker",
      [
        "expo-splash-screen",
        {
          image: "./assets/images/splash-icon.png",
          imageWidth: 200,
          resizeMode: "contain",
          backgroundColor: "#ffffff"
        }
      ]
    ],
    extra: {
      SUPABASE_URL: process.env.SUPABASE_URL || "https://utvolelclhzesimpwbrl.supabase.co",
      SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV0dm9sZWxjbGh6ZXNpbXB3YnJsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIxMTU4MTcsImV4cCI6MjA2NzY5MTgxN30.M2d3R611-y_t26xsN3R6-Y0uf5bRVRDni16-m2mF1tY",
    },
  },
}; 