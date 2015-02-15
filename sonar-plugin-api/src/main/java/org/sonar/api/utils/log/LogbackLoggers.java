/*
 * SonarQube, open source software quality management tool.
 * Copyright (C) 2008-2014 SonarSource
 * mailto:contact AT sonarsource DOT com
 *
 * SonarQube is free software; you can redistribute it and/or
 * modify it under the terms of the GNU Lesser General Public
 * License as published by the Free Software Foundation; either
 * version 3 of the License, or (at your option) any later version.
 *
 * SonarQube is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
 * Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public License
 * along with this program; if not, write to the Free Software Foundation,
 * Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02110-1301, USA.
 */
package org.sonar.api.utils.log;

import ch.qos.logback.classic.Level;
import org.slf4j.LoggerFactory;

/**
 * Note that this is not "Slf4jLoggers" as there's a coupling on Logback
 * in order to change level of root logger.
 */
class LogbackLoggers extends Loggers {

  @Override
  protected Logger newInstance(String name) {
    return new LogbackLogger(LoggerFactory.getLogger(name));
  }

  @Override
  protected boolean isDebugEnabled() {
    return LoggerFactory.getLogger(org.slf4j.Logger.ROOT_LOGGER_NAME).isDebugEnabled();
  }

  @Override
  protected void enableDebug(boolean b) {
    ch.qos.logback.classic.Logger logback = (ch.qos.logback.classic.Logger) LoggerFactory.getLogger(ch.qos.logback.classic.Logger.ROOT_LOGGER_NAME);
    logback.setLevel(b ? Level.DEBUG : Level.INFO);
  }
}