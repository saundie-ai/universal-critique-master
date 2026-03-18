import React, { useRef, useImperativeHandle, forwardRef } from 'react';
import html2canvas from 'html2canvas';
import type { CritiquePhotoOutput, CritiqueItem } from '@/lib/critique-types';
import type { FormInputs, FileData } from '@/app/page';

interface ExporterProps {
  critique: CritiquePhotoOutput;
  fileData: FileData;
  formInputs: FormInputs;
}

const ScoreBox: React.FC<{ label: string; score: number; isTotal?: boolean }> = ({ label, score, isTotal }) => (
    <div style={{ flex: 1, border: `1px solid ${isTotal ? '#3B82F6' : '#e5e7eb'}`, padding: '15px', borderRadius: '8px', textAlign: 'center', background: isTotal ? '#EFF6FF' : '#f9fafb' }}>
        <div style={{ fontSize: '1.5rem', fontWeight: 700, color: isTotal ? '#2563EB' : '#111827' }}>{(score || 0).toFixed(1)}</div>
        <div style={{ fontSize: '0.7rem', textTransform: 'uppercase', color: '#6b7280' }}>{label}</div>
    </div>
);

const DetailRow: React.FC<{ item: CritiqueItem }> = ({ item }) => (
    <tr style={{ background: '#4a5568' }}>
        <td style={{ color: 'white', padding: '10px', borderBottom: '1px solid #4a5568', verticalAlign: 'top', fontSize: '0.85rem' }}><strong>{item.criterion}</strong></td>
        <td style={{ color: 'white', padding: '10px', borderBottom: '1px solid #4a5568', verticalAlign: 'top', fontSize: '0.85rem' }}>{item.commentary}</td>
        <td style={{ color: 'white', padding: '10px', borderBottom: '1px solid #4a5568', verticalAlign: 'top', fontSize: '0.85rem', textAlign: 'center' }}>{item.score}/10</td>
    </tr>
);

export const CritiqueExporter = forwardRef<{ export: () => void }, ExporterProps>(({ critique, fileData, formInputs }, ref) => {
  const exportRef = useRef<HTMLDivElement>(null);

  useImperativeHandle(ref, () => ({
    export: () => {
      if (exportRef.current) {
        html2canvas(exportRef.current, {
            scale: 2,
            useCORS: true,
            backgroundColor: '#ffffff',
            logging: false,
        }).then(canvas => {
            const link = document.createElement('a');
            link.download = `critique_${formInputs.title || 'summary'}.png`;
            link.href = canvas.toDataURL('image/png');
            link.click();
        });
      }
    },
  }));
  
  const pp = critique.postProduction;
  const ppItems = [
      { t: 'Cropping', c: pp.cropping },
      { t: 'Global', c: pp.globalAdjustments },
      { t: 'Local', c: pp.localAdjustments },
      { t: 'Color', c: pp.colorGrading },
      { t: 'Retouching', c: pp.retouching }
  ];

  return (
    <div ref={exportRef} style={{ position: 'absolute', left: '-9999px', top: 0, width: '800px', background: 'white', color: 'black', padding: '40px', fontFamily: 'Inter, sans-serif' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', borderBottom: '2px solid #111827', paddingBottom: '15px', marginBottom: '25px' }}>
            <div>
                <h1 style={{ margin: 0, fontSize: '1.8rem', fontWeight: 800, color: '#111827' }}>Universal Critique Master</h1>
                <p style={{ fontSize: '14px', color: '#6b7280', margin: '5px 0 0' }}>Automated Professional Photography Analysis</p>
            </div>
            <div style={{ textAlign: 'right', fontSize: '14px', color: '#6b7280' }}>
                {formInputs.photographer && <div style={{ fontWeight: 'bold', color: '#111827', marginBottom: '4px' }}>{`Photographer: ${formInputs.photographer}`}</div>}
                <div>Date: {new Date().toLocaleDateString()}</div>
            </div>
        </div>

        <div style={{ display: 'flex', gap: '30px', marginBottom: '30px' }}>
            <div style={{ width: '40%' }}>
                <div style={{ width: '100%', height: '220px', background: '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
                    <img src={fileData.dataUrl} style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} alt="Analyzed Photograph"/>
                </div>
                <div style={{ marginTop: '10px', fontSize: '10px', fontFamily: 'monospace', color: '#4b5563', background: '#f9fafb', padding: '8px', borderRadius: '4px', border: '1px solid #e5e7eb' }}>
                    {fileData.exif}
                </div>
                {formInputs.title && <div style={{ marginTop: '10px', textAlign: 'center', fontWeight: 700, fontSize: '14px', color: '#111827' }}>{`"${formInputs.title}"`}</div>}
            </div>
            <div style={{ width: '60%' }}>
                <h2 style={{ marginTop: 0, borderBottom: '2px solid #2563eb', paddingBottom: '8px', marginBottom: '15px', color: '#111827', fontSize: '1.2rem', fontWeight: 700 }}>Score Summary</h2>
                <div style={{ display: 'flex', gap: '15px', marginBottom: '20px' }}>
                    <ScoreBox label="Technical" score={critique.technicalAverage} />
                    <ScoreBox label="Artistic" score={critique.artisticAverage} />
                    <ScoreBox label="Total" score={critique.totalAverage} isTotal />
                </div>
                <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '8px', color: '#111827' }}>Closing Remarks</h3>
                <p style={{ fontSize: '13px', lineHeight: 1.5, color: '#4b5563', fontStyle: 'italic' }}>{critique.closingRemarks}</p>
            </div>
        </div>

        <h2 style={{ borderBottom: '2px solid #3b82f6', paddingBottom: '8px', marginBottom: '15px', color: '#3b82f6', fontSize: '1.3rem', fontWeight: 700 }}>1. Technical Merit</h2>
        <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '20px' }}>
            <thead><tr style={{ background: '#f3f4f6' }}><th style={{ width: '25%', color: '#1f2937', padding: '10px', textTransform: 'uppercase', fontSize: '0.75rem', borderBottom: '2px solid #e5e7eb', textAlign: 'left' }}>Criterion</th><th style={{ color: '#1f2937', padding: '10px', textTransform: 'uppercase', fontSize: '0.75rem', borderBottom: '2px solid #e5e7eb', textAlign: 'left' }}>Commentary</th><th style={{ width: '12%', color: '#1f2937', padding: '10px', textTransform: 'uppercase', fontSize: '0.75rem', borderBottom: '2px solid #e5e7eb', textAlign: 'center' }}>Score</th></tr></thead>
            <tbody>{critique.technicalMerit.map((item, i) => <DetailRow key={i} item={item}/>)}</tbody>
        </table>

        <h2 style={{ borderBottom: '2px solid #3b82f6', paddingBottom: '8px', marginBottom: '15px', color: '#3b82f6', fontSize: '1.3rem', fontWeight: 700 }}>2. Artistic Merit</h2>
        <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '20px' }}>
            <thead><tr style={{ background: '#f3f4f6' }}><th style={{ width: '25%', color: '#1f2937', padding: '10px', textTransform: 'uppercase', fontSize: '0.75rem', borderBottom: '2px solid #e5e7eb', textAlign: 'left' }}>Criterion</th><th style={{ color: '#1f2937', padding: '10px', textTransform: 'uppercase', fontSize: '0.75rem', borderBottom: '2px solid #e5e7eb', textAlign: 'left' }}>Commentary</th><th style={{ width: '12%', color: '#1f2937', padding: '10px', textTransform: 'uppercase', fontSize: '0.75rem', borderBottom: '2px solid #e5e7eb', textAlign: 'center' }}>Score</th></tr></thead>
            <tbody>{critique.artisticMerit.map((item, i) => <DetailRow key={i} item={item} />)}</tbody>
        </table>
        
        <h2 style={{ color: '#7c3aed', borderBottom: '2px solid #7c3aed', paddingBottom: '8px', marginBottom: '15px', fontSize: '1.2rem', fontWeight: 700, marginTop: '30px' }}>3. Post-Production Recommendations</h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginTop: '10px' }}>
            {ppItems.map((item, i) => (
                <div key={i} style={{ background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: '6px', padding: '10px' }}>
                    <div style={{ color: '#7c3aed', fontWeight: 700, fontSize: '0.8rem', marginBottom: '4px', textTransform: 'uppercase' }}>{item.t}</div>
                    <div style={{ fontSize: '0.8rem', color: '#374151', lineHeight: 1.4 }}>{item.c}</div>
                </div>
            ))}
        </div>

        {formInputs.userContext && (
            <div style={{ marginTop: '25px' }}>
                 <h3 style={{ fontSize: '14px', fontWeight: 700, marginBottom: '5px', color: '#4b5563' }}>Artist's Context</h3>
                 <p style={{ fontSize: '12px', color: '#374151', fontStyle: 'italic', background: '#f3f4f6', padding: '10px', borderRadius: '4px', borderLeft: '3px solid #9ca3af', margin: 0 }}>{formInputs.userContext}</p>
            </div>
        )}

        <div style={{ marginTop: '30px', paddingTop: '15px', borderTop: '1px solid #e5e7eb', fontSize: '10px', color: '#9ca3af', textAlign: 'justify' }}>
            <strong>LEGAL DISCLAIMER:</strong> This report was generated by an AI system. The scores and critiques provided are for informational and entertainment purposes only.
        </div>
    </div>
  );
});

CritiqueExporter.displayName = 'CritiqueExporter';
