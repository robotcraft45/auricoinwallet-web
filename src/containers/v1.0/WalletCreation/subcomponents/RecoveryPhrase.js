/**
 *
 * TomoWallet - Wallet Creation Page - Recovery Phrase Generation
 *
 * This component shows user a randomly generated mnemonic phrase, waiting to be noted down offline
 */
// ===== IMPORTS =====
// Modules
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { generateMnemonic } from 'bip39';
import {
  Container,
  Row,
  Col,
  Card,
  CardHeader,
  CardTitle,
  CardBody,
  CardText,
  CardFooter,
} from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// Custom Component
// -- TO-DO: Update style for buttons
import { ButtonStyler } from '../../../../styles';
// Utilities
import { withIntl } from '../../../../components/IntlProvider';
import { withWeb3 } from '../../../../components/Web3';
import { MSG } from '../../../../constants';
import { FORM_STATES } from '../constants';
import { mnemonicToPrivateKey } from '../../../../utils';
// -- TO-DO: Add style for Recovery Phrase generation page
// ===================

// ===== MAIN COMPONENT =====
class RecoveryPhrase extends PureComponent {
  constructor(props) {
    super(props);

    this.handleConvertMnemonic = this.handleConvertMnemonic.bind(this);
  }

  componentDidMount() {
    const { storeMnemonic, rpcServer, setPrivateKey } = this.props;
    const newMnemonic = generateMnemonic();
    storeMnemonic(newMnemonic);
    setPrivateKey(mnemonicToPrivateKey(newMnemonic, rpcServer));
  }

  handleConvertMnemonic() {
    const { mnemonic } = this.props;
    return mnemonic.split(' ');
  }

  render() {
    const {
      intl: { formatMessage },
      setFormState,
      toggleConfirmationPopup,
      toggleKeyViewPopup,
    } = this.props;
    const convertedMnemonic = this.handleConvertMnemonic();
    return (
      <Container fluid>
        <Row noGutters>
          <Col
            xs={12}
            sm={12}
            md={{ size: 10, offset: 1 }}
            lg={{ size: 6, offset: 3 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>
                  {formatMessage(MSG.RECOVERY_PHRASE_TITLE)}
                </CardTitle>
              </CardHeader>
              <CardBody>
                <CardTitle>
                  {formatMessage(MSG.RECOVERY_PHRASE_NOTIFICATION_TITLE)}
                </CardTitle>
                <CardText>
                  {formatMessage(MSG.RECOVERY_PHRASE_NOTIFICATION_DESCRIPTION)}
                </CardText>
              </CardBody>
              <Container fluid className='px-3'>
                <Row noGutters className='mb-3 border rounded'>
                  {convertedMnemonic.map((word, wordIdx) => (
                    <Col
                      key={`word_${wordIdx + 1}`}
                      xs={6}
                      sm={6}
                      md={4}
                      lg={4}
                      className='p-4'
                    >
                      {`${wordIdx + 1}. ${word}`}
                    </Col>
                  ))}
                </Row>
                <Row noGutters className='mb-5'>
                  <Col>
                    <FontAwesomeIcon icon={['far', 'save']} className='mr-2' />
                    {formatMessage(MSG.RECOVERY_PHRASE_BUTTON_SAVE)}
                  </Col>
                  <Col className='text-right'>
                    <div
                      role='presentation'
                      onClick={() => toggleKeyViewPopup(true)}
                    >
                      {formatMessage(
                        MSG.RECOVERY_PHRASE_BUTTON_VIEW_PRIVATE_KEY,
                      )}
                      <FontAwesomeIcon icon='arrow-right' className='ml-2' />
                    </div>
                  </Col>
                </Row>
              </Container>
              <CardFooter>
                <Container fluid className='px-0'>
                  <Row noGutters>
                    <Col className='pr-2'>
                      <ButtonStyler
                        onClick={() => setFormState(FORM_STATES.WARNING)}
                      >
                        {formatMessage(MSG.COMMON_BUTTON_BACK)}
                      </ButtonStyler>
                    </Col>
                    <Col className='pl-2'>
                      <ButtonStyler
                        onClick={() => toggleConfirmationPopup(true)}
                      >
                        {formatMessage(MSG.RECOVERY_PHRASE_BUTTON_CONFIRMATION)}
                      </ButtonStyler>
                    </Col>
                  </Row>
                </Container>
              </CardFooter>
            </Card>
          </Col>
        </Row>
      </Container>
    );
  }
}
// ==========================

// ===== PROP TYPES =====
RecoveryPhrase.propTypes = {
  /** React Intl's instance object */
  intl: PropTypes.object,
  /** Recovery phrase string (12 words) */
  mnemonic: PropTypes.string,
  /** Current RPC server configuration */
  rpcServer: PropTypes.object,
  /** Action to update Recovery Phrase form state */
  setFormState: PropTypes.func,
  /** Action to store private key */
  setPrivateKey: PropTypes.func,
  /** Action to store mnemonic into state */
  storeMnemonic: PropTypes.func,
  /** Action to toggle recovery phrase confirmation popup */
  toggleConfirmationPopup: PropTypes.func,
  /** Action to toggle private key view popup */
  toggleKeyViewPopup: PropTypes.func,
};

RecoveryPhrase.defaultProps = {
  intl: {},
  mnemonic: '',
  rpcServer: {},
  storeMnemonic: () => {},
  toggleConfirmationPopup: () => {},
};
// ======================

export default compose(
  withIntl,
  withWeb3,
)(RecoveryPhrase);
