// src/ReportGenerator.js
import React from 'react';
import { Page, Text, View, Document, StyleSheet, Image } from '@react-pdf/renderer';

// Define styles for the PDF
const styles = StyleSheet.create({
    page: { fontFamily: 'Helvetica', fontSize: 11, paddingTop: 30, paddingLeft: 60, paddingRight: 60, paddingBottom: 30, color: '#333' },
    header: { fontSize: 24, textAlign: 'center', marginBottom: 20, fontFamily: 'Helvetica-Bold', color: '#1a2c4e' },
    section: { marginBottom: 15 },
    sectionTitle: { fontSize: 16, fontFamily: 'Helvetica-Bold', marginBottom: 10, borderBottom: '2px solid #1a2c4e', paddingBottom: 3, color: '#1a2c4e' },
    subTitle: { fontSize: 12, fontFamily: 'Helvetica-Bold', marginBottom: 5 },
    text: { marginBottom: 5, lineHeight: 1.4 },
    archetypeBox: { backgroundColor: '#f0f4f8', padding: 10, borderRadius: 5, marginBottom: 10 },
    decisionRow: { display: 'flex', flexDirection: 'row', borderBottom: '1px solid #eee', paddingBottom: 5, paddingTop: 5 },
    decisionCol1: { width: '60%' },
    decisionCol2: { width: '20%', textAlign: 'center' },
    decisionCol3: { width: '20%', textAlign: 'center' },
    tableHeader: { display: 'flex', flexDirection: 'row', borderBottom: '2px solid #333', paddingBottom: 5, fontFamily: 'Helvetica-Bold' },
    chartImage: { width: '80%', height: 'auto', alignSelf: 'center', marginTop: 10, marginBottom: 20 },
});

export const ReportDocument = ({ data, charts }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      
      <Text style={styles.header}>CyberGuard After-Action Debrief</Text>

      {/* --- Executive Summary --- */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>1.0 AI Executive Summary</Text>
        <Text style={styles.text}>{data.aiAnalysis.executiveSummary}</Text>
      </View>

      {/* --- Performance Archetype --- */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>2.0 Performance Archetype</Text>
        <View style={styles.archetypeBox}>
            <Text style={styles.subTitle}>{data.aiAnalysis.performanceArchetype.name}</Text>
            <Text style={styles.text}>{data.aiAnalysis.performanceArchetype.description}</Text>
        </View>
      </View>

      {/* --- Performance Dashboard --- */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>3.0 Performance Dashboard</Text>
        <Text style={styles.text}>Scenario: {data.scenarioTitle}</Text>
        <Text style={styles.text}>Final Score: {data.finalScore}</Text>
        <Text style={styles.text}>Total Time: {data.totalTime}</Text>
        {charts.scoreChart && <Image src={charts.scoreChart} style={styles.chartImage} />}
      </View>

      {/* --- Decision Deep Dive --- */}
      <View style={styles.section} break> {/* `break` creates a new page */}
        <Text style={styles.sectionTitle}>4.0 Decision-by-Decision Deep Dive</Text>
        <View style={styles.tableHeader}>
            <Text style={styles.decisionCol1}>Player Choice</Text>
            <Text style={styles.decisionCol2}>Time Taken</Text>
            <Text style={styles.decisionCol3}>Points</Text>
        </View>
        {data.choiceHistory.map((choice, index) => (
            <View key={index} style={styles.decisionRow}>
                <View style={styles.decisionCol1}>
                    <Text style={styles.subTitle}>{choice.choice}</Text>
                    <Text style={{fontSize: 9, color: '#666'}}>AI Analysis: {data.aiAnalysis.decisionAnalysis[index]?.analysis || 'N/A'}</Text>
                </View>
                <Text style={styles.decisionCol2}>{choice.timeTaken}s</Text>
                <Text style={styles.decisionCol3}>{choice.points}</Text>
            </View>
        ))}
      </View>

      {/* --- Actionable Recommendations --- */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>5.0 Actionable Recommendations</Text>
        {data.aiAnalysis.actionableRecommendations.map((rec, index) => (
            <Text key={index} style={styles.text}>• {rec}</Text>
        ))}
      </View>
      
    </Page>
  </Document>
);