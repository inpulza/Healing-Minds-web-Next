import type { BilingualPageContent } from '../types';

export const cancellationPolicyContent: BilingualPageContent = {
  en: {
    title: 'Cancellation and No-Show Policy',
    sections: [
      {
        key: 'intro',
        paragraphs: [
          `Contact the office promptly if you need to cancel or reschedule an appointment. The office will provide the current cancellation and no-show terms in writing and can confirm them before an appointment is accepted.`,
        ],
      },
      {
        key: 'requirement',
        heading: `Cancellation Requirement`,
        paragraphs: [
          `The required notice period, if any, is the period disclosed in the current written terms provided by the office. Ask the office to confirm it for your appointment.`,
        ],
      },
      {
        key: 'fee',
        heading: `Late Cancellation or No-Show Fee`,
        bullets: [
          `A late-cancellation or no-show fee applies only if it was disclosed and acknowledged in writing and is permitted by applicable law.`,
          `Ask the office to confirm the current fee, if any, before scheduling.`,
        ],
      },
      {
        key: 'confirmation',
        heading: `Appointment Confirmation`,
        paragraphs: [
          `The office will explain any reminder or confirmation process that applies to your appointment. Contact the office directly if you are unsure whether an appointment or cancellation was received.`,
        ],
      },
      {
        key: 'exceptions',
        heading: `Policy Exceptions`,
        paragraphs: [
          `Questions about emergencies or other exceptions are reviewed under the current written policy and applicable law. Contact the office for the terms that apply to your circumstances.`,
        ],
      },
      {
        key: 'acknowledgment',
        heading: `Policy Acknowledgment`,
        paragraphs: [
          `The cancellation and no-show terms disclosed and acknowledged in writing for your appointment govern, subject to applicable law.`,
        ],
      },
    ],
  },
  es: {
    title: 'Política de Cancelación y No Asistencia',
    sections: [
      {
        key: 'intro',
        paragraphs: [
          `Contacte la oficina lo antes posible si necesita cancelar o reprogramar una cita. La oficina proporcionará por escrito los términos vigentes de cancelación y no asistencia y puede confirmarlos antes de aceptar una cita.`,
        ],
      },
      {
        key: 'requirement',
        heading: `Requisito de Cancelación`,
        paragraphs: [
          `El plazo de aviso requerido, si lo hay, es el indicado en los términos escritos vigentes proporcionados por la oficina. Pida a la oficina que lo confirme para su cita.`,
        ],
      },
      {
        key: 'fee',
        heading: `Cargo por Cancelación Tardía o No Asistencia`,
        bullets: [
          `Un cargo por cancelación tardía o no asistencia se aplica únicamente si fue divulgado y aceptado por escrito y está permitido por la ley aplicable.`,
          `Pida a la oficina que confirme el cargo vigente, si lo hay, antes de programar.`,
        ],
      },
      {
        key: 'confirmation',
        heading: `Confirmación de Citas`,
        paragraphs: [
          `La oficina explicará cualquier proceso de recordatorio o confirmación que corresponda a su cita. Contacte directamente a la oficina si no sabe si se recibió una cita o cancelación.`,
        ],
      },
      {
        key: 'exceptions',
        heading: `Excepciones a la Política`,
        paragraphs: [
          `Las preguntas sobre emergencias u otras excepciones se revisan conforme a la política escrita vigente y la ley aplicable. Contacte la oficina para conocer los términos que correspondan a sus circunstancias.`,
        ],
      },
      {
        key: 'acknowledgment',
        heading: `Reconocimiento de la Política`,
        paragraphs: [
          `Rigen los términos de cancelación y no asistencia divulgados y aceptados por escrito para su cita, sujetos a la ley aplicable.`,
        ],
      },
    ],
  },
};
