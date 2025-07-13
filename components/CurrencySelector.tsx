import { useCurrency } from '@/lib/CurrencyContext';
import React, { useState } from 'react';
import {
    Modal,
    SafeAreaView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';

export default function CurrencySelector() {
  const [modalVisible, setModalVisible] = useState(false);
  const { selectedCurrency, setSelectedCurrency, currencies, getCurrencySymbol } = useCurrency();

  const changeCurrency = async (currencyCode: string) => {
    try {
      await setSelectedCurrency(currencyCode);
      setModalVisible(false);
    } catch (error) {
      console.error('Failed to change currency:', error);
    }
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  return (
    <>
      <TouchableOpacity
        style={styles.currencyButton}
        onPress={() => setModalVisible(true)}
      >
        <Feather name="dollar-sign" size={20} color="#666" />
        <Text style={styles.currencyCode}>
          {getCurrencySymbol(selectedCurrency)}
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
                <Text style={styles.modalTitle}>Select Currency</Text>
                <TouchableOpacity
                  onPress={closeModal}
                  style={styles.closeButton}
                >
                  <Feather name="x" size={24} color="#666" />
                </TouchableOpacity>
              </View>
              
              <View style={styles.currencyContainer}>
                {currencies.map((currency) => (
                  <TouchableOpacity
                    key={currency.code}
                    style={[
                      styles.currencyOption,
                      selectedCurrency === currency.code && styles.selectedCurrency,
                    ]}
                    onPress={() => changeCurrency(currency.code)}
                  >
                    <Text style={styles.currencyFlag}>{currency.flag}</Text>
                    <Text style={[
                      styles.currencyName,
                      selectedCurrency === currency.code && styles.selectedCurrencyText,
                    ]}>
                      {currency.name} ({currency.code})
                    </Text>
                    {selectedCurrency === currency.code && (
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
  currencyButton: {
    padding: 8,
    marginRight: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  currencyCode: {
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
  currencyContainer: {
    paddingVertical: 8,
    backgroundColor: '#FFFFFF',
  },
  currencyOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    minHeight: 56,
    backgroundColor: '#FFFFFF',
  },
  selectedCurrency: {
    backgroundColor: '#f0f8ff',
  },
  currencyFlag: {
    fontSize: 24,
    marginRight: 16,
  },
  currencyName: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  selectedCurrencyText: {
    color: '#007AFF',
    fontWeight: '600',
  },
}); 