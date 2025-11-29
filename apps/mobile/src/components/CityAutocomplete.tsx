import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
import { cityAutocompleteService, CityAutocompleteResult } from '../services/cityAutocomplete';
import { useDebounce } from '../hooks/useDebounce';

interface CityAutocompleteProps {
  placeholder: string;
  value: string;
  onSelect: (city: string) => void;
  containerStyle?: any;
}

export function CityAutocomplete({ placeholder, value, onSelect, containerStyle }: CityAutocompleteProps) {
  const [query, setQuery] = useState(value);
  const [predictions, setPredictions] = useState<CityAutocompleteResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showPredictions, setShowPredictions] = useState(false);

  const debouncedQuery = useDebounce(query, 500);

  useEffect(() => {
    setQuery(value);
  }, [value]);

  useEffect(() => {
    if (debouncedQuery && debouncedQuery.length > 2 && showPredictions) {
      fetchPredictions(debouncedQuery);
    } else {
      setPredictions([]);
    }
  }, [debouncedQuery, showPredictions]);

  const fetchPredictions = async (input: string) => {
    setIsLoading(true);
    try {
      const results = await cityAutocompleteService.getPredictions(input);
      setPredictions(results || []);
    } catch (error) {
      console.error('Failed to fetch cities', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelect = (item: CityAutocompleteResult) => {
    const cityName = item.structured_formatting.main_text;
    setQuery(cityName);
    onSelect(cityName);
    setShowPredictions(false);
  };

  return (
    <View style={[styles.container, containerStyle]}>
      <Text style={styles.label}>{placeholder}</Text>
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        value={query}
        onChangeText={(text) => {
          setQuery(text);
          setShowPredictions(true);
        }}
        onFocus={() => setShowPredictions(true)}
      />

      {isLoading && <ActivityIndicator style={styles.loader} />}

      {showPredictions && predictions.length > 0 && (
        <View style={styles.predictionsContainer}>
          <FlatList
            data={predictions}
            keyExtractor={(item) => item.place_id}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.predictionItem}
                onPress={() => handleSelect(item)}
              >
                <Text style={styles.mainText}>{item.structured_formatting.main_text}</Text>
                <Text style={styles.secondaryText}>{item.structured_formatting.secondary_text}</Text>
              </TouchableOpacity>
            )}
            keyboardShouldPersistTaps="handled"
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    zIndex: 1,
    position: 'relative',
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#09090b',
    marginBottom: 6,
  },
  input: {
    height: 44,
    borderWidth: 1,
    borderColor: '#e4e4e7',
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 14,
    color: '#09090b',
    backgroundColor: '#ffffff',
  },
  loader: {
    position: 'absolute',
    right: 12,
    top: 38,
  },
  predictionsContainer: {
    position: 'absolute',
    top: 70,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e4e4e7',
    maxHeight: 200,
    zIndex: 1000,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  predictionItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f4f4f5',
  },
  mainText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#09090b',
  },
  secondaryText: {
    fontSize: 12,
    color: '#71717a',
  },
});
