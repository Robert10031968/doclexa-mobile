import React from 'react';
import { Image, Modal, Pressable, Text, TouchableOpacity, View } from 'react-native';

interface NavbarProps {
  selectedLanguage: string;
  languageCodes: Array<{ code: string; label: string }>;
  showLanguageModal: boolean;
  setShowLanguageModal: (show: boolean) => void;
  setSelectedLanguage: (language: string) => void;
  handleLogout: () => void;
  t: (key: string) => string;
}

const Navbar: React.FC<NavbarProps> = ({
  selectedLanguage,
  languageCodes,
  showLanguageModal,
  setShowLanguageModal,
  setSelectedLanguage,
  handleLogout,
  t
}) => {
  return (
    <>
      <View style={styles.navbar}>
        <View style={styles.logoContainer}>
          <Image
            source={require('../assets/images/logo.png')}
            style={{ width: 175, height: 70 }}
            resizeMode="contain"
            onError={(error) => console.log('Logo loading error:', error)}
          />
        </View>
        <View style={styles.navbarRight}>
          <TouchableOpacity
            style={styles.languageDropdownTrigger}
            onPress={() => setShowLanguageModal(true)}
          >
            <Text style={styles.languageDropdownIcon}>🌐</Text>
            <Text style={styles.languageDropdownText}>
              {t('language')}: {languageCodes.find(l => l.code === selectedLanguage)?.label || 'English'}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.logoutButton}
            onPress={handleLogout}
          >
            <Text style={styles.logoutButtonText}>{t('logout')}</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Language Dropdown Modal */}
      <Modal
        visible={showLanguageModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowLanguageModal(false)}
      >
        <Pressable style={styles.modalOverlay} onPress={() => setShowLanguageModal(false)}>
          <View style={styles.languageModalContent}>
            {languageCodes.map((lang) => (
              <TouchableOpacity
                key={lang.code}
                style={[
                  styles.languageOption,
                  selectedLanguage === lang.code && styles.languageOptionSelected
                ]}
                onPress={() => {
                  setSelectedLanguage(lang.code);
                  setShowLanguageModal(false);
                }}
              >
                <Text
                  style={[
                    styles.languageOptionText,
                    selectedLanguage === lang.code && styles.languageOptionTextSelected
                  ]}
                >
                  {lang.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </Pressable>
      </Modal>
    </>
  );
};

const styles = {
  navbar: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    alignItems: 'center' as const,
    paddingVertical: 10,
    paddingHorizontal: 2, // Reduced from 4px to 2px for closer positioning
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 3,
  },
  logoContainer: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    flex: 1,
    paddingLeft: 2, // Reduced from 4px to 2px for even closer positioning
  },
  navbarRight: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    flexShrink: 0,
  },
  languageDropdownTrigger: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    paddingHorizontal: 6, // Reduced from 8px to 6px for tighter spacing
    paddingVertical: 8,
    borderRadius: 6,
    backgroundColor: '#f0f0f0',
    minWidth: 80,
  },
  languageDropdownIcon: {
    fontSize: 20,
    marginRight: 6,
  },
  languageDropdownText: {
    fontSize: 12,
    color: '#333',
    fontWeight: '600' as const,
    flexShrink: 1,
  },
  logoutButton: {
    backgroundColor: '#FF3B30',
    paddingHorizontal: 6, // Reduced from 8px to 6px for tighter spacing
    paddingVertical: 6,
    borderRadius: 6,
    marginLeft: 4, // Reduced from 6px to 4px for closer positioning
  },
  logoutButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600' as const,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.2)',
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
  },
  languageModalContent: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    minWidth: 220,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  languageOption: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 6,
    marginBottom: 4,
  },
  languageOptionSelected: {
    backgroundColor: '#007AFF',
  },
  languageOptionText: {
    fontSize: 16,
    color: '#333',
  },
  languageOptionTextSelected: {
    color: '#fff',
    fontWeight: 'bold' as const,
  },
};

export default Navbar; 