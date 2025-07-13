import { useTranslation } from '@/hooks/useTranslation';
import { i18n } from '@/lib/i18n';
import React, { useEffect, useState } from 'react';
import {
    Modal,
    SafeAreaView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';

const languages = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'pl', name: 'Polski', flag: '🇵🇱' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'pt', name: 'Português', flag: '🇵🇹' },
];

export default function LanguageSelector() {
  const [modalVisible, setModalVisible] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState('en');
  const [isInitialized, setIsInitialized] = useState(false);
  const { t } = useTranslation();

  // Initialize i18n and set up language listener
  useEffect(() => {
    const initializeI18n = async () => {
      try {
        await i18n.initialize();
        setCurrentLanguage(i18n.getLanguage());
        setIsInitialized(true);
      } catch (error) {
        console.error('Failed to initialize i18n:', error);
        setIsInitialized(true); // Still set to true to show the component
      }
    };

    initializeI18n();

    // Listen for language changes
    const listener = () => {
      setCurrentLanguage(i18n.getLanguage());
    };
    i18n.addListener(listener);
    
    return () => i18n.removeListener(listener);
  }, []);

  const changeLanguage = async (languageCode: string) => {
    try {
      await i18n.changeLanguage(languageCode);
      setCurrentLanguage(languageCode);
      setModalVisible(false);
    } catch (error) {
      console.error('Failed to change language:', error);
    }
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  // Show loading state until i18n is initialized
  if (!isInitialized) {
    return (
      <View style={styles.globeButton}>
        <Text style={styles.languageCode}>...</Text>
      </View>
    );
  }

  return (
    <>
      <TouchableOpacity
        style={styles.globeButton}
        onPress={() => setModalVisible(true)}
      >
        <Feather name="globe" size={20} color="#666" />
        <Text style={styles.languageCode}>
          {currentLanguage.toUpperCase()}
        </Text>
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={closeModal}
      >
        <TouchableOpacity 
          style={styles.modalOverlay} 
          activeOpacity={1} 
          onPress={closeModal}
        >
          <TouchableOpacity 
            style={styles.modalContent} 
            activeOpacity={1}
            onPress={() => {}} // Prevent closing when tapping content
          >
            <SafeAreaView style={styles.modalSafeArea}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>{t('selectLanguage')}</Text>
                <TouchableOpacity
                  onPress={closeModal}
                  style={styles.closeButton}
                >
                  <Feather name="x" size={24} color="#666" />
                </TouchableOpacity>
              </View>
              
              <View style={styles.languageContainer}>
                {languages.map((language) => (
                  <TouchableOpacity
                    key={language.code}
                    style={[
                      styles.languageOption,
                      currentLanguage === language.code && styles.selectedLanguage,
                    ]}
                    onPress={() => changeLanguage(language.code)}
                  >
                    <Text style={styles.languageFlag}>{language.flag}</Text>
                    <Text style={[
                      styles.languageName,
                      currentLanguage === language.code && styles.selectedLanguageText,
                    ]}>
                      {language.name}
                    </Text>
                    {currentLanguage === language.code && (
                      <Feather name="check" size={20} color="#007AFF" />
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            </SafeAreaView>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  globeButton: {
    padding: 8,
    marginRight: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  languageCode: {
    fontSize: 12,
    fontWeight: '600',
    color: '#666',
    marginLeft: 6,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-start',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    marginTop: 0,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 8,
  },
  modalSafeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
    backgroundColor: '#FFFFFF',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  closeButton: {
    padding: 4,
  },
  languageContainer: {
    paddingVertical: 8,
    backgroundColor: '#FFFFFF',
  },
  languageOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    minHeight: 56,
    backgroundColor: '#FFFFFF',
  },
  selectedLanguage: {
    backgroundColor: '#f0f8ff',
  },
  languageFlag: {
    fontSize: 24,
    marginRight: 16,
  },
  languageName: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  selectedLanguageText: {
    color: '#007AFF',
    fontWeight: '600',
  },
}); 