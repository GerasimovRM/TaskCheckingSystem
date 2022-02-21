import React from 'react';

import {
  Button,
  Heading,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
} from '@chakra-ui/react';

export default function Page404() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <>
      <Heading as="h1" size="2xl" mb={5}>
        Страница не найдена
      </Heading>
      <Button colorScheme="red" size="lg" variant="outline" onClick={onOpen}>
        ПОМОГИТЕ :(
      </Button>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Виджет помощи</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            Exorcizo te, immundissime spiritus, omnis incursio adversarii, omne
            phantasma, omnis legio, in nomine Domini nostri Jesu Christi
            eradicare, et effugare ab hoc plasmate Dei. Ipse tibi imperat, qui
            te de supernis caelorum in inferiora terrae demergi praecepit. Ipse
            tibi imperat, qui mari, ventis, et tempestatibus impersvit. Audi
            ergo, et time, satana, inimice fidei, hostis generis humani, mortis
            adductor, vitae raptor, justitiae declinator, malorum radix, fomes
            vitiorum, seductor hominum, proditor gentium, incitator invidiae,
            origo avaritiae, causa discordiae, excitator dolorum: quid stas, et
            resistis, cum scias. Christum Dominum vias tuas perdere? Illum
            metue, qui in Isaac immolatus est, in joseph venumdatus, in sgno
            occisus, in homine cruci- fixus, deinde inferni triumphator fuit.
            Sequentes cruces fiant in fronte obsessi. Recede ergo in nomine
            Patris et Filii, et Spiritus Sancti: da locum Spiritui Sancto, per
            hoc signum sanctae Cruci Jesu Christi Domini nostri: Qui cum Patre
            et eodem Spiritu Sancto vivit et regnat Deus, Per omnia saecula
            saeculorum. Et cum spiritu tuo. Amen.
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={onClose}>
              Понял
            </Button>
            <Button colorScheme="blue" mr={3} onClick={onClose}>
              Принял
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}