import { API_CONFIG } from "@/config/api.config";
import axios from "axios";

export const api = axios.create(API_CONFIG);
