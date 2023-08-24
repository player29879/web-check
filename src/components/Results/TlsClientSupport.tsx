
import { useState } from 'react';
import styled from 'styled-components';
import colors from 'styles/colors';
import { Card } from 'components/Form/Card';
import Button from 'components/Form/Button';
import Row, { ExpandableRow } from 'components/Form/Row';


// "name": "Android",
// "curve": "secp256r1",
// "version": "6.0",
// "platform": "",
// "protocol": "TLSv1.2",
// "curve_code": 23,
// "ciphersuite": "ECDHE-RSA-CHACHA20-POLY1305-OLD",
// "is_supported": true,
// "protocol_code": 771,
// "ciphersuite_code": 52243

const makeClientSupport = (results: any) => {
  if (!results?.analysis) return [];
  const target = results.target;
  const sslLabsClientSupport = (
      results.analysis.find((a: any) => a.analyzer === 'sslLabsClientSupport')
    ).result;

  return sslLabsClientSupport.map((sup: any) => {
    return {
      title: `${sup.name} ${sup.platform ?  `(on ${sup.platform})`: sup.version}`,
      value: sup.is_supported ? '✅' : '❌',
      fields: sup.is_supported ? [
        sup.curve ? { lbl: 'Curve', val: sup.curve } : {},
        { lbl: 'Protocol', val: sup.protocol },
        { lbl: 'Cipher Suite', val: sup.ciphersuite },
        { lbl: 'Protocol Code', val: sup.protocol_code },
        { lbl: 'Cipher Suite Code', val: sup.ciphersuite_code },
        { lbl: 'Curve Code', val: sup.curve_code },
      ] : [
        { lbl: '', val: '',
        plaintext: `The host ${target} does not support ${sup.name} `
          +`${sup.version ?  `version ${sup.version} `: ''} `
          + `${sup.platform ?  `on ${sup.platform} `: ''}`}
      ],
    };
  });
  
};

const TlsCard = (props: {data: any, title: string, actionButtons: any }): JSX.Element => {

  const [clientSupport, setClientSupport] = useState(makeClientSupport(props.data));
  const [loadState, setLoadState] = useState<undefined | 'loading' | 'success' | 'error'>(undefined);

  const updateData = (id: number) => {
    setClientSupport([]);
    setLoadState('loading');
    const fetchUrl = `https://tls-observatory.services.mozilla.com/api/v1/results?id=${id}`;
    fetch(fetchUrl)
      .then((response) => response.json())
      .then((data) => {
        setClientSupport(makeClientSupport(data));
        setLoadState('success');
    }).catch(() => {
      setLoadState('error');
    });
  };
  
  const scanId = props.data?.id;
  return (
    <Card heading={props.title} actionButtons={props.actionButtons}>
      {clientSupport.map((support: any) => {
        return (<ExpandableRow lbl={support.title} val={support.value || '?'} rowList={support.fields} />)
      })}
      { !clientSupport.length && (
        <div>
          <p>No entries available to analyze.<br />
            This sometimes happens when the report didn't finish generating in-time, you can try re-requesting it.
          </p>
          <Button loadState={loadState} onClick={() => updateData(scanId)}>Refetch Report</Button>
        </div>
      )}
    </Card>
  );
}

export default TlsCard;
